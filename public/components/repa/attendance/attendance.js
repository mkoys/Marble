import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaAttendance extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("attendance.css", import.meta.url);
        this.useTemplate("/components/repa/attendance/attendance.html");
        this.closeCallback = () => {};
    }

    close(callback) {
        this.closeCallback = callback;
    }

    load = () => {
        const closeElement = this.shadowRoot.querySelector(".close");
        const weekText = this.shadowRoot.querySelector(".week");
        const dateText = this.shadowRoot.querySelector(".date");

        closeElement.addEventListener("click", () => {
            this.closeCallback();
        });

        if(this.getAttribute("week")) {
            weekText.textContent = "Week " + this.getAttribute("week"); 
        }

        if(this.getAttribute("date")) {
            dateText.textContent = this.getAttribute("date"); 
        }

        let box = this.shadowRoot.querySelector(".box");
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
                }else {
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