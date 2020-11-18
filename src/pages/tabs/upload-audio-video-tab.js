import '../../components/file-upload/content-file-drop.js';
import '../../components/file-upload/upload-confirmation.js';
import '../../components/file-upload/upload-progress-indicator.js';
import { html, LitElement } from 'lit-element';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin';
import { MobxReactionUpdate } from '@adobe/lit-mobx';
import UploadStatus from '../../util/upload-status';

class UploadAudioVideoTab extends MobxReactionUpdate(DependencyRequester(LitElement)) {
	async connectedCallback() {
		super.connectedCallback();
		this.uploader = this.requestDependency('uploader');
	}

	render() {
		switch (this.uploader.uploadStatus) {
			case UploadStatus.IDLE:
				return html`<content-file-drop></content-file-drop>`;
			case UploadStatus.LOADING:
				return html`<upload-progress-indicator></upload-progress-indicator>`;
			case UploadStatus.SUCCESSFUL:
				return html`<upload-confirmation></upload-confirmation>`;
		}
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
