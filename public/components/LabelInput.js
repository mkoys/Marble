import BaseComponent from "../source/BaseComponent.js";

export default class LabelInput extends BaseComponent {

    static get observedAttributes() { return ["label", "type"] }

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

            default:
                break;
        }
    }
}