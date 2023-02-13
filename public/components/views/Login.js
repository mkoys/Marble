import config from "../../config.js";
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

            this.submit = this.shadowRoot.querySelector(".submit");
            this.credentials = this.shadowRoot.querySelector("#credentials");
            this.password = this.shadowRoot.querySelector("#password");

            this.submit.addEventListener("click", async () => {
                let body = {
                    password: this.password.getValue()
                }

                if (this.credentials.getValue().includes("@")) {
                    body.email = this.credentials.getValue();
                } else {
                    body.username = this.credentials.getValue();
                }

                const result = await fetch(config.baseURL + "/auth/login", {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const resultJson = await result.json();

                console.log(resultJson);

                if (resultJson.token) {
                    localStorage.setItem("token", resultJson.token);
                    this.router.setRoute("repa");
                }
            });
        };

    }
}