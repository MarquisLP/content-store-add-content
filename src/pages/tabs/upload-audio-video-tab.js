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
			errorMessage: { type: String }
		};
	}

	constructor() {
		super();
		this.tabStatus = TabStatus.PROMPT;
		this.contentTitle = '';
		this.errorMessage = '';
	}

	render() {
		switch (this.tabStatus) {
			case TabStatus.PROMPT:
				return html`<content-file-drop error-message=${this.errorMessage} @stage-file-for-upload=${this.onStageFileForUpload} @upload-error=${this.onUploadError}></content-file-drop>`;
			case TabStatus.CONFIRMAITON:
				return html`<upload-confirmation content-title=${this.contentTitle}></upload-confirmation>`;
			case TabStatus.UPLOADING:
				return html`<upload-progress-indicator></upload-progress-indicator>`;
		}
	}

	onStageFileForUpload(event) {
		this.file = event.file;

		const filename = event.detail.file.name;
		this.contentTitle = filename.substring(0, filename.lastIndexOf('.'));

		this.tabStatus = TabStatus.CONFIRMAITON;
	}

	onUploadError(event) {
		this.errorMessage = event.detail.message;
		this.tabStatus = TabStatus.PROMPT;
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
