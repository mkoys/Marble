import BaseComponent from "../../source/BaseComponent.js";
import router from "../../router.js";

export default class MarbleLogin extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Auth.css", import.meta.url);
        this.useTemplate("/components/views/Login.html");
        this.load = () => {
            this.router = router();
            this.shadowRoot.querySelector(".redirect").addEventListener("click", () => {
                this.router.setRoute("register");
            });
        };

    }
}