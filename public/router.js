import Router from "./source/Router.js";

let router;

export default () => {
    if (!router) {
        const root = document.querySelector("body");
        router = new Router({ root });
        router.addRoute("login", document.createElement("marble-login"));
        router.addRoute("register", document.createElement("marble-register"));
        router.addRoute("repa", document.createElement("marble-repa"));

        const token = localStorage.getItem("token");

        if (token) {
            router.setRoute("repa");
        }else {
            router.setRoute("login");
        }

        return router;
    } else {
        return router;
    }

}