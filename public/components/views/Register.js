import BaseComponent from "../../source/BaseComponent.js";
import router from "../../router.js";

export default class MarbleRegister extends BaseComponent {
    constructor() {
        super();

        this.addStyle("reset.css");
        this.addStyle("Auth.css", import.meta.url);
        this.useTemplate("/components/views/Register.html");

        this.load = () => {
            this.submit = this.shadowRoot.querySelector(".submit");
            this.username = this.shadowRoot.querySelector("#username");
            this.email = this.shadowRoot.querySelector("#email");
            this.password = this.shadowRoot.querySelector("#password");
            this.day = this.shadowRoot.querySelector("#day");
            this.month = this.shadowRoot.querySelector("#month");
            this.year = this.shadowRoot.querySelector("#year");

            this.submit.addEventListener("click", async () => {
                console.log(
                    this.username.getValue(),
                    this.email.getValue(),
                    this.password.getValue(),
                    this.day.getValue(),
                    this.month.getValue(),
                    this.year.getValue(),
                );
            });

            this.router = router();
            this.shadowRoot.querySelector(".link").addEventListener("click", () => {
                this.router.setRoute("login");
            });
        }
    }
}