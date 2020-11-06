import './src/pages/tabs-container.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class D2lContentStoreAddContent extends LitElement {
	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	render() {
		return html`
			<d2l-content-store-add-content-tabs-container></d2l-content-store-add-content-tabs-container>
		`;
	}
}
customElements.define('d2l-content-store-add-content', D2lContentStoreAddContent);
