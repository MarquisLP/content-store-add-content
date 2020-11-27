import { action, decorate, flow, observable } from 'mobx';
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
		this.onSuccess = onSuccess;
		this.onError = onError;

		this.uploadProgress = 0;

		this.uploadFile = flow((function * (file, title) {
			/* eslint-disable no-invalid-this */
			yield this._uploadWorkflowAsync(file, title);
			/* eslint-enable no-invalid-this */
		}));
	}

	reset() {
		this.uploadProgress = 0;
	}

	async _monitorProgressAsync(content, revision) {
		try {
			const progress = await this.apiClient.getWorkflowProgress({
				contentId: content.id,
				revisionId: revision.id
			});

			this.uploadProgress = 50 + ((progress.percentComplete || 0) / 2);

			if (progress.ready) {
				this.onSuccess(revision.d2lrn);
				return;
			}
		} catch (error) {
			this.onError(resolveWorkerError(error));
			return;
		}

		await sleep(randomizeDelay(5000, 1000));
		await this._monitorProgressAsync(content, revision);
	}

	async _uploadWorkflowAsync(file, title) {
		try {
			const extension = file.name.split('.').pop();
			const content = await this.apiClient.createContent();
			const revision = await this.apiClient.createRevision(
				content.id,
				{
					title,
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

			await this._monitorProgressAsync(content, revision);
		} catch (error) {
			this.onError(resolveWorkerError(error));
		}
	}
}

decorate(Uploader, {
	uploadProgress: observable,
	uploadFile: action,
	reset: action
});
