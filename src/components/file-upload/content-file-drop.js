import 'file-drop-element';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { bodySmallStyles, bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin';

class ContentFileDrop extends DependencyRequester(InternalLocalizeMixin(LitElement)) {
	static get properties() {
		return {
			_supportedMimeTypes: { type: Array }
		};
	}

	static get styles() {
		return [ bodySmallStyles, bodyStandardStyles, heading2Styles, css`
			file-drop {
				display: block;
				border: 2px dashed var(--d2l-color-corundum);
				padding: 40px;
			}
			file-drop.drop-valid {
				background-color: var(--d2l-color-gypsum);
				border: 2px dashed var(--d2l-color-feedback-action);
			}
			file-drop.drop-invalid {
				background-color: var(--d2l-color-gypsum);
				border: 2px dashed var(--d2l-color-feedback-error);
			}
			#file-size-limit {
				margin-top: 20px;
			}
		`];
	}

	constructor() {
		super();
		this._supportedMimeTypes = [];
	}

	async connectedCallback() {
		super.connectedCallback();
		this.client = this.requestDependency('content-service-client');
		this._supportedMimeTypes = await this.client.getSupportedMimeTypes();
	}

	render() {
		return html`
			<file-drop accept=${this._supportedMimeTypes.join(',')}>
				<center>
					<h2 class="d2l-heading-2">${this.localize('dropAudioVideoFile')}</h2>
					<p class="d2l-body-standard">${this.localize('or')}</p>
					<d2l-button>${this.localize('browse')}</d2l-button>
					<p id="file-size-limit" class="d2l-body-small">${this.localize('fileLimit1Gb')}</p>
				</center>
			</file-drop>
		`;
	}
}

window.customElements.define('content-file-drop', ContentFileDrop);
