import BaseComponent from "../../source/BaseComponent.js";

export default class MarbleDropdown extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.useTemplate("/components/dropdown/Dropdown.html");
        
        this.load = async () => {
            await this.addStyle("Dropdown.css", import.meta.url);
            this.droped = true;
            this.currentOptions = [];
            this.allOptions = [];

            this.options = this.getAttribute("options");

            this.optionsElement = this.shadowRoot.querySelector(".options");
            this.optionsInput = this.shadowRoot.querySelector("input");

            this.optionsInput.setAttribute("placeholder", this.getAttribute("name"));
            this.optionsInput.addEventListener("focusin", () => { this.open() });
            this.optionsInput.addEventListener("focusout", () => {
                if (this.selected) {
                    this.findOption(this.selected);
                    this.optionsInput.value = this.selected;
                } else if (this.currentOptions.length >= 1 && this.optionsInput.value !== "") {
                    this.findOption(this.currentOptions[0]);
                    this.optionsInput.value = this.currentOptions[0];
                }

                this.close();
            });

            this.renderOptions(this.options);

            this.optionsInput.addEventListener("input", (event) => {
                this.currentOptions = [];
                this.selected = null;
                this.findOption(event.target.value);
            });

            this.shadowRoot.querySelector("svg").addEventListener("click", () => {
                if (this.droped) {
                    this.optionsInput.focus();
                    this.droped = false;
                } else {
                    this.optionsInput.blur();
                    this.droped = true;
                }
            });
        }
    }

    getValue = () => { return this.shadowRoot.querySelector("input").value }
    close() { this.optionsElement.style.display = "none" }
    open() { this.optionsElement.style.display = "flex" }

    renderOptions(options) {
        this.optionsElement.innerHTML = "";
        if (options.includes(";")) {
            options.split(";").forEach(option => this.addOption(option));
        } else if (options.includes("-")) {
            const splitArgs = options.split("-");
            for (let index = splitArgs[0]; index <= splitArgs[1]; index++) { this.addOption(index) }
        } else {
            this.addOption(options)
        }
    }

    findOption(value) {
        let result = [];

        if (this.options.includes(";")) {
            this.options.split(";").forEach(item => {
                if (item.toString().toLowerCase().startsWith(value.toString().toLowerCase())) {
                    result.push(item);
                }
            });
        } else {
            const splitArgs = this.options.split("-");
            for (let index = splitArgs[0]; index < splitArgs[1]; index++) {
                if (index.toString().toLowerCase().startsWith(value.toString().toLowerCase())) {
                    result.push(index);
                }
            }
        }
        if (result.length > 0) {
            this.currentOptions = result;
            this.renderOptions(result.join(";"));
        } else {
            this.currentOptions = [];
            this.renderOptions(this.options);
        }
    }

    addOption(optionInput) {
        this.allOptions.push(optionInput);

        let optionHolder = document.createElement("div");
        let optionBox = document.createElement("div");
        let optionText = document.createElement("p");

        optionHolder.addEventListener("mouseover", () => { this.selected = optionInput });
        optionHolder.addEventListener("mouseout", () => { this.selected = null });

        optionText.textContent = optionInput;
        optionBox.appendChild(optionText);
        optionHolder.appendChild(optionBox);
        
        this.optionsElement.appendChild(optionHolder);
    }
}