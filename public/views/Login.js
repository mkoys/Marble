import BaseComponent from "../source/BaseComponent.js";

export default class Login extends BaseComponent {
    constructor() {
        super();

        this.useTemplate("/views/Login.html");
    }
}