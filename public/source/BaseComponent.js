export default class BaseComponent extends HTMLElement {
    constructor({ } = {}) {
        super();
        this.attachShadow({ mode: "open" });
        this.load = () => { };
    }

    connectedCallback() {
        //this.load();
    }

    useTemplate(templatePath, root = "root") {
        fetch(templatePath).then(res => res.text().then(text => {
            const parser = new DOMParser();
            const parsedTemplate = parser.parseFromString(text, "text/html");
            let template = parsedTemplate.getElementById(root).content;
            this.shadowRoot.appendChild(template.cloneNode(true));
            this.load();
        }));
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

        const found = templateMap.get(finalPath);

        if (found) {
            styleElement.textContent = found;
        } else {
            const result = await fetch(finalPath);
            const style = await result.text();
            templateMap.add(finalPath, style);
            styleElement.textContent = style;
        }

        this.shadowRoot.appendChild(styleElement);
    }
}