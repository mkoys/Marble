import BaseComponent from "../../source/BaseComponent.js";

export default class MarbleInput extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("LabelInput.css", import.meta.url);
        this.useTemplate("/components/labelInput/LabelInput.html");

        this.load = () => {
            if (this.getAttribute("link")) {
                const newLink = document.createElement("a");

                newLink.href = "#";
                newLink.textContent = this.getAttribute("link");
                newLink.className = "link inputLink";
                
                this.shadowRoot.querySelector(".input").appendChild(newLink);
            }
    
            this.shadowRoot.querySelector("label").textContent = this.getAttribute("label");
            this.shadowRoot.querySelector("input").setAttribute("type", this.getAttribute("type"));
        }

        this.getValue = () => {
            return this.shadowRoot.querySelector("input").value;
        }
    }
}