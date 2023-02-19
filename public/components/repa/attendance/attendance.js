import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaAttendance extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("attendance.css", import.meta.url);
        this.useTemplate("/components/repa/attendance/attendance.html");
        this.closeCallback = () => { };
    }

    close(callback) {
        this.closeCallback = callback;
    }

    load = () => {
        const closeElement = this.shadowRoot.querySelector(".close");
        const weekText = this.shadowRoot.querySelector(".week");
        const dateText = this.shadowRoot.querySelector(".date");
        const buttonMenu = this.shadowRoot.querySelector(".buttons");

        const moreButton = this.shadowRoot.querySelector(".more");
        const submitButton = this.shadowRoot.querySelector(".submit");
        const saveButton = this.shadowRoot.querySelector(".save");

        const closeTooltip = this.shadowRoot.querySelector(".tooltipClose");
        const moreTooltip = this.shadowRoot.querySelector(".tooltipMore");
        const submitTooltip = this.shadowRoot.querySelector(".tooltipSubmit");
        const saveTooltip = this.shadowRoot.querySelector(".tooltipSave");

        const schoolCheckbox = this.shadowRoot.querySelector(".school");
        const companyCheckbox = this.shadowRoot.querySelector(".company");

        schoolCheckbox.addEventListener("click", (e) => {
            if (e.target.checked && companyCheckbox.checked) {
                companyCheckbox.action();
            }
        })

        companyCheckbox.addEventListener("click", (e) => {
            if (e.target.checked && schoolCheckbox.checked) {
                schoolCheckbox.action();
            }
        })

        closeElement.addEventListener("mouseenter", () => closeTooltip.open());
        closeElement.addEventListener("mouseleave", () => closeTooltip.close());

        moreButton.addEventListener("mouseenter", () => moreTooltip.open());
        moreButton.addEventListener("mouseleave", () => moreTooltip.close());

        submitButton.addEventListener("mouseenter", () => submitTooltip.open());
        submitButton.addEventListener("mouseleave", () => submitTooltip.close());

        saveButton.addEventListener("mouseenter", () => saveTooltip.open());
        saveButton.addEventListener("mouseleave", () => saveTooltip.close());

        let box = this.shadowRoot.querySelector(".box");
        let finalValue = { date: this.getAttribute("date"), content: [] };

        if (this.getAttribute("nobutton")) {
            buttonMenu.classList.add("hideMenu");
        }

        if (this.getAttribute("noclose")) {
            closeElement.classList.add("hide");
        } else {
            closeElement.addEventListener("click", () => {
                this.closeCallback();
            });
        }

        if (this.getAttribute("week")) {
            weekText.textContent = "Week " + this.getAttribute("week");
        }

        if (this.getAttribute("date")) {
            dateText.textContent = this.getAttribute("date");
        }

        this.data = () => {
            finalValue = { date: this.getAttribute("date"), content: [] };
            for (let index = 1; index < box.children.length - 1; index++) {
                const item = box.children[index];
                const description = item.querySelector(".description").value;
                const time = item.querySelector(".time").value;
                const classType = item.querySelector(".class").value;
                if (description !== "" || time !== "" || classType !== "") {
                    finalValue.content.push({
                        description,
                        classType,
                        time
                    })
                }
            }

            return finalValue;
        }


        saveButton.addEventListener("click", () => {
            const data = this.data();
            console.log(data);
        });

        let inputsElement = this.shadowRoot.querySelector(".boxInput");
        let inputsElementEmpty = inputsElement.cloneNode(true);
        let previous = null;

        let description = inputsElement.querySelector(".description");
        let time = inputsElement.querySelector(".time");
        let classType = inputsElement.querySelector(".class");

        description.addEventListener("input", () => checkNext());
        time.addEventListener("input", () => checkNext());
        classType.addEventListener("input", () => checkNext());

        function checkNext() {
            if (description.value || time.value || classType.value) {
                if (previous) {
                    previous.description.removeEventListener("input", () => checkBefore())
                    previous.time.removeEventListener("input", () => checkBefore())
                    previous.classType.removeEventListener("input", () => checkBefore())
                }

                description.removeEventListener("input", () => checkNext());
                time.removeEventListener("input", () => checkNext());
                classType.removeEventListener("input", () => checkNext());

                previous = { description, time, classType, inputsElement };

                previous.description.addEventListener("input", () => checkBefore())
                previous.time.addEventListener("input", () => checkBefore())
                previous.classType.addEventListener("input", () => checkBefore())

                const inputsElementCopy = inputsElementEmpty.cloneNode(true);
                inputsElement = inputsElementCopy;
                description = inputsElement.querySelector(".description");
                time = inputsElement.querySelector(".time");
                classType = inputsElement.querySelector(".class");

                description.addEventListener("input", () => checkNext());
                time.addEventListener("input", () => checkNext());
                classType.addEventListener("input", () => checkNext());
                box.insertBefore(inputsElement, box.children[box.childElementCount - 1]);
            }
        }

        function checkBefore() {
            if (previous && !description.value && !time.value && !classType.value && !previous.description.value && !previous.time.value && !previous.classType.value) {
                box.removeChild(box.children[box.childElementCount - 2]);
                const before = box.children[box.childElementCount - 3];

                previous.description.removeEventListener("input", () => checkBefore())
                previous.time.removeEventListener("input", () => checkBefore())
                previous.classType.removeEventListener("input", () => checkBefore())
                const current = previous;

                if (before.classList.contains("boxInput")) {
                    const description = before.querySelector(".description");
                    const time = before.querySelector(".time");
                    const classType = before.querySelector(".class");

                    previous = { description, time, classType, inputsElement: before }

                    previous.description.addEventListener("input", () => checkBefore())
                    previous.time.addEventListener("input", () => checkBefore())
                    previous.classType.addEventListener("input", () => checkBefore())
                } else {
                    previous = null;
                }

                checkBefore();

                inputsElement = current.inputsElement;
                description = inputsElement.querySelector(".description");
                time = inputsElement.querySelector(".time");
                classType = inputsElement.querySelector(".class");
                description.focus();

                description.addEventListener("input", () => checkNext());
                time.addEventListener("input", () => checkNext());
                classType.addEventListener("input", () => checkNext());
            }
        }
    }
}