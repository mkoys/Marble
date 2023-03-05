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

            const register = this.shadowRoot.querySelector(".register");
            register.addEventListener("click", (event) => {
                event.preventDefault();
                this.router.setRoute("register"); 
            });
        })
    }
}