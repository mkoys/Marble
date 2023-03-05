import BaseComponent from "../source/BaseComponent.js";

export default class LabelInput extends BaseComponent {

    static get observedAttributes() { return ["text"] }

    constructor() {
        super();
        this.addStyle("/style.css");
        this.addStyle("/components/Button.css");
        this.useTemplate("/components/Button.html");

        this.connected(() => {
            this.clickCallback = () => { };
            this.click = (callback) => this.clickCallback = callback;
    
            const buttonElement = this.shadowRoot.querySelector("button");
            buttonElement.addEventListener("click", () => this.clickCallback());
        })
    }


    async attributeChangedCallback(name, oldValue, newValue) {
        await this.load;
        switch (name) {
            case "text":
                const buttonElement = this.shadowRoot.querySelector("button");
                buttonElement.textContent = newValue;
                break;

            default:
                break;
        }
    }
}