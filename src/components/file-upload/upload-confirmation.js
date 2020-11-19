import { html, LitElement } from 'lit-element';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin';
import { MobxReactionUpdate } from '@adobe/lit-mobx';

class UploadConfirmation extends MobxReactionUpdate(DependencyRequester(LitElement)) {
	async connectedCallback() {
		super.connectedCallback();
		this.tabStore = this.requestDependency('upload-audio-video-tab-store');
	}

	render() {
		return html`
			<h1>Skeleton for Upload Confirmation</h1>
			<p>File: ${this.tabStore.contentTitle}</p>
		`;
	}
}

window.customElements.define('upload-confirmation', UploadConfirmation);
