import '@brightspace-ui/core/components/button/button.js';
import '../../components/file-upload/content-file-drop.js';
import '../../components/file-upload/upload-confirmation.js';
import '../../components/file-upload/upload-progress-indicator.js';
import { css, html, LitElement } from 'lit-element';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin';
import { MobxReactionUpdate } from '@adobe/lit-mobx';
import { Uploader } from '../../state/uploader.js';

const TabStatus = Object.freeze({
	PROMPT: 0,
	CONFIRMATION: 1,
	UPLOADING: 2
});

class UploadAudioVideoTab extends MobxReactionUpdate(DependencyRequester((InternalLocalizeMixin(LitElement)))) {
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

	static get styles() {
		return css`
			#tab-container {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
			}
			#tab-content-container {
				width: 100%;
				overflow-y: scroll;
			}
			#top-level-buttons {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				margin-top: 20px;
			}
			#top-level-buttons > * {
				margin: 5px;
			}
		`;
	}

	constructor() {
		super();
		this.tabStatus = TabStatus.PROMPT;
		this.contentTitle = '';
		this.errorMessage = '';
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';

		this.reactToUploadError = this.reactToUploadError.bind(this);
		this.reactToUploadSuccess = this.reactToUploadSuccess.bind(this);
	}

	async connectedCallback() {
		super.connectedCallback();
		this.apiClient = this.requestDependency('content-service-client');

		this.uploader = new Uploader({
			apiClient: this.apiClient,
			onSuccess: this.reactToUploadSuccess,
			onError: this.reactToUploadError
		});
	}

	render() {
		let tabContent;
		switch (this.tabStatus) {
			case TabStatus.PROMPT:
				tabContent = html`
					<content-file-drop
						error-message=${this.errorMessage}
						@stage-file-for-upload=${this.onStageFileForUpload}
						@upload-error=${this.onUploadError}></content-file-drop>
					`;
				break;
			case TabStatus.CONFIRMATION:
				tabContent = html`
					<upload-confirmation
						content-title=${this.contentTitle}
						file-name=${this.fileName}
						file-size=${this.fileSize}
						file-type=${this.fileType}
						@change-content-title=${this.onChangeContentTitle}
						@discard-staged-file=${this.onDiscardStagedFile}></upload-confirmation>
					`;
				break;
			case TabStatus.UPLOADING:
				tabContent = html`
					<upload-progress-indicator></upload-progress-indicator>
				`;
		}

		let saveButton;
		if ((this.tabStatus === TabStatus.CONFIRMATION) && this.contentTitle) {
			saveButton = html`<d2l-button primary @click=${this.onSaveClick}>${this.localize('save')}</d2l-button>`;
		} else {
			saveButton = html`<d2l-button primary disabled>${this.localize('save')}</d2l-button>`;
		}

		let cancelButton;
		if ([TabStatus.PROMPT, TabStatus.CONFIRMATION].includes(this.tabStatus)) {
			cancelButton = html`<d2l-button>${this.localize('cancel')}</d2l-button>`;
		} else {
			cancelButton = html`<d2l-button disabled>${this.localize('cancel')}</d2l-button>`;
		}

		return html`<div id="tab-container">
			<div id="tab-content-container">
				${tabContent}
			</div>
			<div id="top-level-buttons">
				${saveButton}
				${cancelButton}
			</div>
		</div>`;
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

	onSaveClick() {
		this.uploader.uploadFile(this.file, this.contentTitle);
		this.tabStatus = TabStatus.UPLOADING;
	}

	onStageFileForUpload(event) {
		this.file = event.detail.file;
		this.fileName = event.detail.file.name;
		this.fileSize = event.detail.file.size;
		this.fileType = event.detail.file.type;
		this.contentTitle = this.fileName.substring(0, this.fileName.lastIndexOf('.'));
		this.tabStatus = TabStatus.CONFIRMATION;
		this.errorMessage = '';
	}

	onUploadError(event) {
		this.errorMessage = event.detail.message;
		this.file = undefined;
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';
		this.contentTitle = '';
		this.tabStatus = TabStatus.PROMPT;
	}

	reactToUploadError(error) {
		this.errorMessage = this.localize(error);
		this.uploader.reset();
		this.file = undefined;
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';
		this.contentTitle = '';
		this.tabStatus = TabStatus.PROMPT;
	}

	reactToUploadSuccess(contentId, revisionId) {
		// TODO: Remove this and get the tenant's actual region.
		const region = 'us-east-1';

		this.dispatchEvent(new CustomEvent('d2l-content-store-content-added', {
			detail: {
				d2lrn: `d2l:brightspace:contentservice:${region}:${this.apiClient.tenantId}:${this.fileType}:${contentId}/${revisionId}`
			},
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
