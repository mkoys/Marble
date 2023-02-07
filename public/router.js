import Router from "./source/Router.js";


export default () => {
    const root = document.querySelector(".container");
    
    const router = new Router({ root });
    
    router.addRoute("login", document.createElement("marble-login"));
    
    router.setRoute("login");
}