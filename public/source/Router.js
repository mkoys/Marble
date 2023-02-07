export default class Router {
    constructor({ root } = {}) {
        this.root = root;
        this.current = "";
        this.map = new Map();
    }

    setRoute(newRoute) {
        const route = this.map.get(newRoute);
        if (!route) { return false }
        this.current = newRoute;
        this.root.innerHTML = "";
        this.root.appendChild(route);
        return true;
    }

    addRoute(key, value) { this.map.set(key, value) }

    deleteRoute(key) { this.map.delete(key) }
}
