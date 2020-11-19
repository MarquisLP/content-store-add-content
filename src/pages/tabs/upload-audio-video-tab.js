import '../../components/file-upload/content-file-drop.js';
import '../../components/file-upload/upload-confirmation.js';
import '../../components/file-upload/upload-progress-indicator.js';
import { html, LitElement } from 'lit-element';
import { UploadAudioVideoTabStatus, UploadAudioVideoTabStore } from '../../state/upload-audio-video-tab-store';
import { DependencyProvider } from '../../mixins/dependency-provider-mixin';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin';
import { MobxReactionUpdate } from '@adobe/lit-mobx';

class UploadAudioVideoTab extends MobxReactionUpdate(DependencyProvider(DependencyRequester(LitElement))) {
	async connectedCallback() {
		super.connectedCallback();

		this.uploader = this.requestDependency('uploader');

		this.tabStore = new UploadAudioVideoTabStore();
		this.provideDependency('upload-audio-video-tab-store', this.tabStore);
	}

	render() {
		switch (this.tabStore.status) {
			case UploadAudioVideoTabStatus.PROMPT:
				return html`<content-file-drop></content-file-drop>`;
			case UploadAudioVideoTabStatus.CONFIRMAITON:
				return html`<upload-confirmation></upload-confirmation>`;
			case UploadAudioVideoTabStatus.UPLOADING:
				return html`<upload-progress-indicator></upload-progress-indicator>`;
		}
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
