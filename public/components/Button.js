import BaseComponent from "../source/BaseComponent.js";

export default class LabelInput extends BaseComponent {

    static get observedAttributes() { return ["text"] }

    constructor() {
        super();
    }

    connectedCallback() {
        this.addStyle("/style.css");
        this.addStyle("/components/Button.css");
        this.useTemplate("/components/Button.html");
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.load;
        switch (name) {
            case "text":
                const textElement = this.shadowRoot.querySelector("p");
                textElement.textContent = newValue;
                break;

            default:
                break;
        }
    }
}