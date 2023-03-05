import BaseComponent from "../source/BaseComponent.js";

export default class Login extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addStyle("/style.css");
        this.addStyle("/views/Login.css");
        this.useTemplate("/views/Login.html");
    }
}