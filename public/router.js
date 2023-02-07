import Router from "./source/Router.js";

let router;

export default () => {
    if(!router) {
        const root = document.querySelector(".container");
        router = new Router({ root });
        router.addRoute("login", document.createElement("marble-login"));
        router.addRoute("register", document.createElement("marble-register"));
        router.setRoute("login");
        return router;
    }else {
        return router;
    }
    
}