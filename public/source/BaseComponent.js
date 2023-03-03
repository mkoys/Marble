export default class BaseComponent extends HTMLElement {
    constructor({ } = {}) {
        super();
        this.attachShadow({ mode: "open" });
        this.load = () => { };
    }

    connectedCallback() {
        //this.load();
    }

    async useTemplate(templatePath, root = "root") {
        const templateMap = document.querySelector("marble-resources");
        const parser = new DOMParser();

        const found = await templateMap.get(templatePath);
        const parsedTemplate = parser.parseFromString(found, "text/html");
        const template = parsedTemplate.getElementById(root).content;

        this.shadowRoot.appendChild(template.cloneNode(true));
        this.load();
    }

    async addStyle(path, currentPath) {
        const templateMap = document.querySelector("marble-resources");
        const styleElement = document.createElement("style");

        let originalURL = null;

        if (currentPath) {
            originalURL = currentPath;
        } else {
            originalURL = new URL("..", import.meta.url);
        }

        const finalPath = new URL(path, originalURL).pathname;

        const found = await templateMap.get(finalPath);
        styleElement.textContent = found;

        this.shadowRoot.appendChild(styleElement);
    }
}