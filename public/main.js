import marble from "./marble.js";

import LabelInput from "./components/LabelInput.js";

import Login from "./views/Login.js";

marble.init();

customElements.define("marble-label-input", LabelInput);

customElements.define("marble-login", Login);

const router = marble.router();

router.addRoute("login", document.createElement("marble-login"));

router.setRoute("login");