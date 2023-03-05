import BaseComponent from "../source/BaseComponent.js";

export default class Checkbox extends BaseComponent {

    static get observedAttributes() { return ["checked"] }

    constructor() {
        super();
        this.addStyle("/style.css");
        this.addStyle("/components/Checkbox.css");
        this.useTemplate("/components/Checkbox.html");
        this.checked = false;

        this.connected(async () => {
            await this.load;
            const boxElement = this.shadowRoot.querySelector(".box");
            const checkElement = this.shadowRoot.querySelector(".check");

            boxElement.addEventListener("click", () => {
                this.checked = !this.checked;

                if(this.checked) {
                    checkElement.classList.add("visible");
                }else { 
                    checkElement.classList.remove("visible");
                }
            });
        })
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.load;
        switch (name) {
            case "checked":
                const checkElement = this.shadowRoot.querySelector(".check");

                if(typeof newValue === "string") {
                    newValue = JSON.parse(newValue);
                }

                this.checked = newValue;

                if(this.checked) {
                    checkElement.classList.add("visible");
                }else { 
                    checkElement.classList.remove("visible");
                }
                break;

            default:
                break;
        }
    }
}