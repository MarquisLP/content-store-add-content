import '@brightspace-ui/core/components/tabs/tabs.js';
import '@brightspace-ui/core/components/tabs/tab-panel.js';
import './tabs/upload-audio-video-tab.js';
import { html, LitElement } from 'lit-element';
import { InternalLocalizeMixin } from '../mixins/internal-localize-mixin';

class TabsContainer extends InternalLocalizeMixin(LitElement) {
	render() {
		return html`
			<d2l-tabs max-to-show="3">
				<d2l-tab-panel text=${this.localize('upload')}>
					<d2l-content-store-add-content-upload-audio-video-tab></d2l-content-store-add-content-upload-audio-video-tab>
				</d2l-tab-panel>
			</d2l-tabs>
		`;
	}
}

window.customElements.define('d2l-content-store-add-content-tabs-container', TabsContainer);
