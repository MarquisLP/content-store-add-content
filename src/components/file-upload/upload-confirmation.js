import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin';

class UploadConfirmation extends InternalLocalizeMixin(LitElement) {
	static get properties() {
		return {
			contentTitle: { type: String, attribute: 'content-title' }
		};
	}

	static get styles() {
		return css`
			#content-title {
				padding-top: 10px;
			}
		`;
	}

	constructor() {
		super();
		this.contentTitle = '';
	}

	render() {
		return html`
			<d2l-input-text
				id="content-title"
				aria-haspopup="false"
				aria-invalid=${this.contentTitle === '' ? 'true' : 'false'}
				title=${this.localize('titleForUpload')}
				label="${this.localize('title')}"
				required
				value=${this.contentTitle}
				@input=${this.onContentTitleInput}
				></d2l-input-text>
		`;
	}

	onContentTitleInput(event) {
		this.dispatchEvent(new CustomEvent('change-content-title', {
			detail: {
				contentTitle: event.target.value
			},
			bubbles: true,
			composed: true
		}));
	}
}

window.customElements.define('upload-confirmation', UploadConfirmation);
