import '../../components/file-upload/content-file-drop.js';
import { html, LitElement } from 'lit-element';

class UploadAudioVideoTab extends LitElement {
	render() {
		return html`
			<content-file-drop>
		`;
	}
}

window.customElements.define('d2l-content-store-add-content-upload-audio-video-tab', UploadAudioVideoTab);
