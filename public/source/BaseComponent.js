export default class BaseComponent extends HTMLElement {
    constructor({ } = {}) {
        super();
        this.attachShadow({ mode: "open" });
        this.load = () => {};
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

    addStyle(path, currentPath) {
        const linkElement = document.createElement("link");

        let originalURL = null;

        if (currentPath) {
            originalURL = currentPath;
        } else {
            originalURL = new URL("..", import.meta.url);
        }

        linkElement.setAttribute("rel", "stylesheet");
        linkElement.setAttribute("href", new URL(path, originalURL).pathname);

        this.shadowRoot.appendChild(linkElement);
    }
}