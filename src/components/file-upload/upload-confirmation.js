import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin';

class UploadConfirmation extends InternalLocalizeMixin(LitElement) {
	static get properties() {
		return {
			contentTitle: { type: String, attribute: 'content-title' },
			fileName: { type: String, attribute: 'file-name' },
			fileSize: { type: String, attribute: 'file-size' },
			fileType: { type: String, attribute: 'file-type' }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			#container {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			#content-title {
				padding-top: 10px;
			}
			#staged-file {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-top: 30px;
			}
			#staged-file > * {
				margin: 3px;
			}
			#file-details {
				font-weight: 600;
			}
		`];
	}

	constructor() {
		super();
		this.contentTitle = '';
		this.fileName = '';
		this.fileSize = 0;
		this.fileType = '';
	}

	render() {
		return html`
			<div id="container">
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
				<div id="staged-file">
					<d2l-icon icon="${this.fileType.startsWith('audio') ? 'tier1:file-audio' : 'tier1:file-video'}"></d2l-icon>
					<p id="file-details" class="d2l-body-compact">${this.fileName} (${(this.fileSize / Math.pow(2, 20)).toFixed(2)} MB)</p>
					<d2l-button-icon
						id="change-file-button"
						aria-expanded="false"
						aria-haspopup="false"
						aria-label=${this.localize('changeFile')}
						text="${this.localize('remove')} ${this.fileName}"
						icon="tier1:close-default"
						@click=${this.onChangeFileClick}></d2l-button-icon>
				</div>
			</div>
		`;
	}

	onChangeFileClick() {
		this.dispatchEvent(new CustomEvent('discard-staged-file', {
			bubbles: true,
			composed: true
		}));
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
