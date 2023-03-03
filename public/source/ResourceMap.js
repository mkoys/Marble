import BaseComponent from "./BaseComponent.js";

export default class ResourceMap extends BaseComponent {
    constructor({ } = {}) {
        super();
        this.map = new Map();
        this.shadowRoot.host.style.display = "none";
    }

    add(key, value) {
        this.map.set(key, value);
    }

    get(key) {
        return this.map.get(key);
    }
}