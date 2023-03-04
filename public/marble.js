import ResourceMap from "./source/ResourceMap.js";
import Router from "./source/Router.js";

let routerInstance;

const init = (rootElement = "body") => {
    customElements.define("marble-resources", ResourceMap);
    const resources = document.createElement("marble-resources");
    document.body.appendChild(resources);

    const root = document.querySelector(rootElement);
    routerInstance = new Router({ root });
}

const router = () => {
    return routerInstance;
}

export default { init, router }
