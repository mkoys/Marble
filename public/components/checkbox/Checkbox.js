import BaseComponent from "../../source/BaseComponent.js";

export default class MarbleCheckbox extends BaseComponent {
    constructor() {
        super();

        this.addStyle("reset.css");
        this.addStyle("Checkbox.css", import.meta.url);
        this.useTemplate("/components/checkbox/Checkbox.html");
        this.checked = false;

        this.load = () => {
            this.checkboxElement = this.shadowRoot.querySelector(".checkbox");
            this.checkElement = this.shadowRoot.querySelector("svg");

            this.checkboxElement.addEventListener("keydown", (event) => {
                if (event.key === "Enter") { this.action() }
            });

            this.checkboxElement.addEventListener("click", () => this.action());
        }

    }

    action() {
        this.checked = !this.checked;
        this.checkElement.style.display = this.checked ? "block" : "none";
    }

}