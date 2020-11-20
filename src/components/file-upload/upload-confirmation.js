import { html, LitElement } from 'lit-element';

class UploadConfirmation extends LitElement {
	static get properties() {
		return {
			contentTitle: { type: String, attribute: 'content-title' }
		};
	}

	constructor() {
		super();
		this.contentTitle = '';
	}

	render() {
		return html`
			<h1>Skeleton for Upload Confirmation</h1>
			<p>File: ${this.contentTitle}</p>
		`;
	}
}

window.customElements.define('upload-confirmation', UploadConfirmation);
