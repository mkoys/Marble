export default class BaseComponent extends HTMLElement {
    constructor({ } = {}) {
        super();
        this.attachShadow({ mode: "open" });
    }

    async useTemplate(templatePath, currentPath) {
        const templateMap = document.querySelector("marble-resources");
        const parser = new DOMParser();

        let originalURL = null;

        if (currentPath) {
            originalURL = currentPath;
        } else {
            originalURL = new URL("..", import.meta.url);
        }

        const finalPath = new URL(templateMap, originalURL).pathname;

        const found = await templateMap.get(finalPath);
        const parsedTemplate = parser.parseFromString(found, "text/html");
        const template = parsedTemplate.querySelector("template").content;

        this.shadowRoot.appendChild(template.cloneNode(true));
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