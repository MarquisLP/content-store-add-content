import { action, autorun, decorate, flow, observable } from 'mobx';
import resolveWorkerError from '../util/resolve-worker-error';
import { S3Uploader } from '../util/s3-uploader';

const randomizeDelay = (delay = 30000, range = 5000) => {
	const low = delay - range;
	const random = Math.round(Math.random() * range * 2);
	return low + random;
};

const sleep = async(delay = 0) => {
	await new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, delay);
	});
};

export class Uploader {
	constructor({ apiClient, onSuccess, onError }) {
		this.apiClient = apiClient;
		this.uploadProgress = 0;
		this.ready = false;
		this.error = '';

		this.content = null;
		this.revision = null;

		this.uploadFile = flow((function * (file, title) {
			/* eslint-disable no-invalid-this */
			const uploadInfo = {
				file,
				title,
				extension: file.name.split('.').pop(),
			};

			try {
				yield this._uploadWorkflowAsync(uploadInfo);
			} catch (error) {
				this.error = resolveWorkerError(error);
			}
			/* eslint-enable no-invalid-this */
		}));

		autorun(() => {
			if (this.ready) {
				onSuccess(this.content.id, this.revision.id);
			}
		});
		autorun(() => {
			if (this.error) {
				onError(this.error);
			}
		});
	}

	reset() {
		this.uploadProgress = 0;
		this.ready = false;
		this.error = '';
		this.content = null;
		this.revision = null;
	}

	async _monitorProgressAsync(content, revision, progressCallback) {
		try {
			const progress = await this.apiClient.getWorkflowProgress({
				contentId: content.id,
				revisionId: revision.id
			});
			progressCallback({
				percentComplete: progress.percentComplete,
				ready: progress.ready
			});
			if (progress.ready) {
				return;
			}
		} catch (error) {
			progressCallback({ error });
			return;
		}

		await sleep(randomizeDelay(5000, 1000));
		await this._monitorProgressAsync(content, revision, progressCallback);
	}

	async _uploadWorkflowAsync({ file, title, extension }) {
		try {
			this.content = await this.apiClient.createContent();
			this.revision = await this.apiClient.createRevision(
				this.content.id,
				{
					title,
					extension
				}
			);

			const s3Uploader = new S3Uploader({
				file,
				key: this.revision.s3Key,
				signRequest: ({ file, key }) =>
					this.apiClient.signUploadRequest({
						fileName: key,
						contentType: file.type,
						contentDisposition: 'auto'
					}),
				onProgress: progress => {
					this.uploadProgress = progress / 2;
				}
			});
			await s3Uploader.upload();

			await this.apiClient.processRevision({
				contentId: this.content.id,
				revisionId: this.revision.id
			});

			await this._monitorProgressAsync(this.content, this.revision, ({ percentComplete = 0, ready, error }) => {
				this.uploadProgress = 50 + (percentComplete / 2);
				if (error) {
					this.error = resolveWorkerError(error);
				} else {
					this.ready = ready;
				}
			});
		} catch (error) {
			this.error = resolveWorkerError(error);
		}
	}
}

decorate(Uploader, {
	uploadStatus: observable,
	uploadProgress: observable,
	ready: observable,
	error: observable,
	content: observable,
	revision: observable,
	uploadFile: action,
	reset: action
});
