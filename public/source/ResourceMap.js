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

    async get(key) {
        let found = this.map.get(key);

        if (!found) {
            const result = await fetch(key);
            const value = await result.text();
            this.add(key, value);
            found = value;
        }

        return found;
    }
}