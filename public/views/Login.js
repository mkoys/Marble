import config from "../config.js";
import BaseComponent from "../source/BaseComponent.js";
import marble from "../marble.js";

export default class Login extends BaseComponent {
    constructor() {
        super();
        this.router = marble.router();

        this.addStyle("/style.css");
        this.addStyle("/views/Auth.css");
        this.useTemplate("/views/Login.html");

        this.connected(async () => {
            await this.load;

            const username = this.shadowRoot.querySelector(".username");
            const password = this.shadowRoot.querySelector(".password");

            const register = this.shadowRoot.querySelector(".register");
            const submit = this.shadowRoot.querySelector("marble-button");

            const inputs = { username, password }

            register.addEventListener("click", (event) => {
                event.preventDefault();
                this.router.setRoute("register");
            });

            submit.click(async () => {
                username.removeAttribute("error");
                password.removeAttribute("error");
                username.removeAttribute("message");
                password.removeAttribute("message");

                const data = {
                    username: username.getValue(),
                    password: password.getValue(),
                }

                const response = await login(data);

                const result = checkError(response);

                if (result) {
                    localStorage.setItem("token", response.token)
                    console.log("Logged in!");
                }
            });

            async function login(data) {
                let result;
                try {
                    result = await fetch(config.baseURL + "/auth/login", {
                        method: "POST",
                        body: JSON.stringify(data)
                    });
                } catch (error) { return { error: "Server error" } }

                return await result.json();
            }

            function setError(element, message) {
                element.setAttribute("error", "true");
                element.setAttribute("message", message);
            }

            function checkError(response) {
                if (response.error) {
                    setError(username, response.error);
                    setError(password, response.error);

                    return 0;
                }

                if (response.errors) {
                    response.errors.forEach(error => {
                        const key = Object.keys(error)[0];
                        const value = Object.values(error)[0];
                        const element = inputs[key];

                        switch (value) {
                            case "required":
                                setError(element, "Required");
                                break;
                            case "or":
                                setError(element, "Required");
                                break;
                            case "auth":
                                setError(username, "Invalid credentials");
                                setError(password, "Invalid credentials");
                            default:
                                break;
                        }
                    });

                    return 0;
                }

                return 1;
            }
        });
    }
}