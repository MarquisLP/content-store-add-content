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
		this.contentTitle = '';
	}

	confirmUpload() {
		this.status = UploadAudioVideoTabStatus.UPLOADING;
	}

	discardFile() {
		this.file = null;
		this.status = UploadAudioVideoTabStatus.PROMPT;
	}

	setContentTitle(contentTitle) {
		this.contentTitle = contentTitle;
	}

	setFile(file) {
		this.file = file;
		this.contentTitle = file.name.substring(0, file.name.lastIndexOf('.'));
		this.status = UploadAudioVideoTabStatus.CONFIRMAITON;
	}
}

decorate(UploadAudioVideoTabStore, {
	status: observable,
	file: observable,
	confirmUpload: action,
	discardFile: action,
	setContentTitle: action,
	setFile: action
});
