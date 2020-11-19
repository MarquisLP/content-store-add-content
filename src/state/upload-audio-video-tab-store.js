import { action, decorate, observable } from 'mobx';

export const UploadAudioVideoTabStatus = Object.freeze({
	PROMPT: 0,
	CONFIRMAITON: 1,
	UPLOADING: 2
});

export class UploadAudioVideoTabStore {
	constructor() {
		this.status = UploadAudioVideoTabStatus.PROMPT;
		this.file = null;
	}

	confirmUpload() {
		this.status = UploadAudioVideoTabStatus.UPLOADING;
	}

	discardFile() {
		this.file = null;
		this.status = UploadAudioVideoTabStatus.PROMPT;
	}

	setFile(file) {
		this.file = file;
		this.status = UploadAudioVideoTabStatus.CONFIRMAITON;
	}
}

decorate(UploadAudioVideoTabStore, {
	status: observable,
	file: observable,
	confirmUpload: action,
	discardFile: action,
	setFile: action
});
