import BaseComponent from "../source/BaseComponent.js";

export default class LabelInput extends BaseComponent {

    static get observedAttributes() { return ["label", "type", "message"] }

    constructor() {
        super();
        this.addStyle("/style.css");
        this.addStyle("/components/LabelInput.css");
        this.useTemplate("/components/LabelInput.html");
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.load;

        switch (name) {
            case "label":
                const labelElement = this.shadowRoot.querySelector("label");
                labelElement.textContent = newValue;
                break;
                case "type":
                const inputElement = this.shadowRoot.querySelector("input");
                inputElement.setAttribute("type", newValue);
                break;
            case "message":
                const messageElement = this.shadowRoot.querySelector("p");
                messageElement.textContent = newValue ? "- " + newValue : null;
                break;

            default:
                break;
        }
    }
}