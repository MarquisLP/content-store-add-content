import { action, decorate, flow, observable } from 'mobx';
import resolveWorkerError from '../util/resolve-worker-error';
import { S3Uploader } from '../util/s3-uploader';
import UploadStatus from '../util/upload-status';

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
	constructor({ apiClient }) {
		this.apiClient = apiClient;
		this.uploadStatus = UploadStatus.IDLE;
		this.uploadProgress = 0;
		this.error = '';

		this.uploadFile = flow((function * (file) {
			/* eslint-disable no-invalid-this */
			const uploadInfo = {
				file,
				progress: 0,
				extension: file.name.split('.').pop(),
				err: null
			};

			this.uploadStatus = UploadStatus.LOADING;

			try {
				yield this._uploadWorkflowAsync(uploadInfo);
			} catch (error) {
				this.error = resolveWorkerError(error);
			}
			/* eslint-enable no-invalid-this */
		}));
	}

	reset() {
		this.uploadStatus = UploadStatus.IDLE;
		this.uploadProgress = 0;
		this.error = '';
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

	async _uploadWorkflowAsync({ file, extension }) {
		try {
			const content = await this.apiClient.createContent();
			const revision = await this.apiClient.createRevision(
				content.id,
				{
					title: file.name,
					extension
				}
			);

			const s3Uploader = new S3Uploader({
				file,
				key: revision.s3Key,
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
				contentId: content.id,
				revisionId: revision.id
			});

			await this._monitorProgressAsync(content, revision, ({ percentComplete = 0, ready, error }) => {
				this.progress = 50 + (percentComplete / 2);
				if (error) {
					this.uploadStatus = UploadStatus.IDLE;
					this.error = resolveWorkerError(error);
				} else if (ready) {
					this.uploadStatus = UploadStatus.SUCCESSFUL;
				}
			});
		} catch (error) {
			this.uploadStatus = UploadStatus.IDLE;
			this.error = resolveWorkerError(error);
		}
	}
}

decorate(Uploader, {
	uploadStatus: observable,
	uploadProgress: observable,
	error: observable,
	uploadFile: action,
	reset: action
});
