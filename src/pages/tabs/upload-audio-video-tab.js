import '../../components/file-upload/content-file-drop.js';
import '../../components/file-upload/upload-confirmation.js';
import '../../components/file-upload/upload-progress-indicator.js';
import { html, LitElement } from 'lit-element';

const TabStatus = Object.freeze({
	PROMPT: 0,
	CONFIRMAITON: 1,
	UPLOADING: 2
});

class UploadAudioVideoTab extends LitElement {
	static get properties() {
		return {
			tabStatus: { type: Number },
			contentTitle: { type: String },
			errorMessage: { type: String },
			fileName: { type: String },
			fileSize: { type: Number },
			fileType: { type: String },
		};
	}

	constructor() {
		super();
		this.tabStatus = TabStatus.PROMPT;
		this.contentTitle = '';
		this.errorMessage = '';
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';
	}

	render() {
		switch (this.tabStatus) {
			case TabStatus.PROMPT:
				return html`<content-file-drop error-message=${this.errorMessage} @stage-file-for-upload=${this.onStageFileForUpload} @upload-error=${this.onUploadError}></content-file-drop>`;
			case TabStatus.CONFIRMAITON:
				return html`<upload-confirmation
					content-title=${this.contentTitle}
					file-name=${this.fileName}
					file-size=${this.fileSize}
					file-type=${this.fileType}
					@change-content-title=${this.onChangeContentTitle}
					@discard-staged-file=${this.onDiscardStagedFile}></upload-confirmation>`;
			case TabStatus.UPLOADING:
				return html`<upload-progress-indicator></upload-progress-indicator>`;
		}
	}

	onChangeContentTitle(event) {
		this.contentTitle = event.detail.contentTitle;
	}

	onDiscardStagedFile() {
		this.file = undefined;
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';
		this.contentTitle = '';
		this.tabStatus = TabStatus.PROMPT;
	}

	onStageFileForUpload(event) {
		this.file = event.file;
		this.fileName = event.detail.file.name;
		this.fileSize = event.detail.file.size;
		this.fileType = event.detail.file.type;
		this.contentTitle = this.fileName.substring(0, this.fileName.lastIndexOf('.'));
		this.tabStatus = TabStatus.CONFIRMAITON;
		this.errorMessage = '';
	}

	onUploadError(event) {
		this.errorMessage = event.detail.message;
		this.tabStatus = TabStatus.PROMPT;
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
