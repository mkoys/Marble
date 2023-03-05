import BaseComponent from "../source/BaseComponent.js";

export default class LabelInput extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addStyle("/style.css");
        this.addStyle("/components/LabelInput.css");
        this.useTemplate("/components/LabelInput.html");
    }
}