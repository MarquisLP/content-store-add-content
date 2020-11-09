import 'file-drop-element';
import '@brightspace-ui/core/components/button/button.js';
import { bodySmallStyles, bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin';

class ContentFileDrop extends InternalLocalizeMixin(LitElement) {
	static get styles() {
		return [ bodySmallStyles, bodyStandardStyles, heading2Styles, css`
			file-drop {
				display: block;
				border: 2px dashed lightgrey;
				padding: 40px;
			}
			#file-size-limit {
				margin-top: 20px;
			}
		`];
	}

	render() {
		return html`
			<file-drop>
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
