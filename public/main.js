import marble from "./marble.js";

import LabelInput from "./components/LabelInput.js";
import Button from "./components/Button.js";

import Login from "./views/Login.js";
import Register from "./views/Register.js";

marble.init();

customElements.define("marble-label-input", LabelInput);
customElements.define("marble-button", Button);

customElements.define("marble-login", Login);
customElements.define("marble-register", Register);

const router = marble.router();

router.addRoute("login", document.createElement("marble-login"));
router.addRoute("register", document.createElement("marble-register"));

router.setRoute("login");