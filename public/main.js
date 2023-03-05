import marble from "./marble.js";

import Login from "./views/Login.js";

customElements.define("marble-login", Login);

marble.init();

const router = marble.router();

router.addRoute("login", document.createElement("marble-login"));

router.setRoute("login");