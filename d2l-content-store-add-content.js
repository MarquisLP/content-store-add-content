import './src/pages/tabs-container.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import ContentServiceClient from './src/util/content-service-client';
import { DependencyProvider } from './src/mixins/dependency-provider-mixin';

class D2lContentStoreAddContent extends DependencyProvider(LitElement) {
	static get properties() {
		return {
			apiEndpoint: { type: String, attribute: 'api-endpoint' },
			tenantId: { type: String, attribute: 'tenant-id' }
		};
	}

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

	firstUpdated() {
		super.firstUpdated();

		const apiClient = new ContentServiceClient({
			endpoint: this.apiEndpoint,
			tenantId: this.tenantId
		});
		this.provideDependency('content-service-client', apiClient);
	}

	render() {
		return html`
			<d2l-content-store-add-content-tabs-container></d2l-content-store-add-content-tabs-container>
		`;
	}
}
customElements.define('d2l-content-store-add-content', D2lContentStoreAddContent);
