import BaseComponent from "../../source/BaseComponent.js";

export default class MarbleTooltip extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Tooltip.css", import.meta.url);
        this.useTemplate("/components/tooltip/Tooltip.html");
    }

    load = () => {
        const tooltip = this.shadowRoot.querySelector(".tooltip");

        const text = this.getAttribute("text");

        tooltip.textContent = text;

        tooltip.style.left = `${this.getAttribute("left") || 0}px`;

        let leaving = false;
        let clear = false;

        this.open = () => {
            leaving = true;
            clear = setTimeout(() => {
                tooltip.classList.remove("closed");
                leaving = false;
            }, 500);
        }

        this.close = () => {
            if (leaving) {
                clearTimeout(clear);
            }

            tooltip.classList.add("closed");
        }
    }
}