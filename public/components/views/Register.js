import config from "../../config.js";
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
                const body = {
                    username: this.username.getValue(),
                    email: this.email.getValue(),
                    password: this.password.getValue(),
                    "re-password": this.password.getValue()
                }

                const result = await fetch(config.baseURL + "/auth/register", {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const resultJson = await result.json();

                console.log(resultJson);

            });



            this.router = router();
            this.shadowRoot.querySelector(".redirect").addEventListener("click", () => {
                this.router.setRoute("login");
            });
        }
    }
}