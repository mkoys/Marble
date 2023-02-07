import BaseComponent from "../../source/BaseComponent.js";

export default class MarbleLogin extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Auth.css", import.meta.url);
        this.useTemplate("/components/views/Login.html");
    }
}