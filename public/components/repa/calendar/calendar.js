import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaCalendar extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("calendar.css", import.meta.url);
        this.useTemplate("/components/repa/calendar/calendar.html");
        this.currentSelect = [];
        this.rangeSelected = [];
        this.selectedCallback = () => { }
        let currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        this.load = () => {

            const nextElement = this.shadowRoot.querySelector(".next");
            const backElement = this.shadowRoot.querySelector(".back");

            nextElement.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                this.renderCalendar(currentDate);
            });

            backElement.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                this.renderCalendar(currentDate);
            });

            this.renderCalendar(currentDate);
            
            let downArrow = this.shadowRoot.querySelector('.downArrow')
            downArrow.addEventListener('click', (e) => {
                let dropdown = this.shadowRoot.querySelector('.dropdown')
                dropdown.classList.toggle("hidden")
                if (downArrow.classList.contains('rotatedArrow')) {
                    downArrow.classList.remove('rotatedArrow')
                } else {
                    downArrow.classList.add('rotatedArrow')
                }
            })

            let startOfYears = 2000;
            let currentYear = currentDate.getFullYear();
            const arrYears = new Array(1000).fill(null).map(() => startOfYears++);

            let arrIndex = arrYears.indexOf(currentYear);
            let finalArrOfYears = arrYears.slice(arrIndex - 3, arrIndex + 4);

            let text = "";
            for (let i = 0; i < finalArrOfYears.length; i++) {
                const para = document.createElement("li");
                if(i == 3){
                    para.classList.add("menuItem","currentYear");
                }else{
                    para.classList.add("menuItem");
                }
                const element = this.shadowRoot.querySelector(".menu");
                text = finalArrOfYears[i];
                para.textContent = text;
                element.appendChild(para);
            }

            /*
            hore je uz downarrow s touto funkcionalitou
            let dropdown = this.shadowRoot.querySelector('.dropdown')
            dropdown.addEventListener('click', (e) => {
                if (dropdown.classList.contains('closed')) {
                    dropdown.classList.remove('closed')
                } else {
                    dropdown.classList.add('closed')
                }
            })*/
        }

        this.renderCalendar = (date) => {
            const dateElement = this.shadowRoot.querySelector(".dates");
            const dateTextElement = this.shadowRoot.querySelector(".currentText");

            dateTextElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`

            const currentDays = getAllDaysInMonth(date.getFullYear(), date.getMonth(), true);
            let start = currentDays[0].date.getDay() - 1;
            start = start < 0 ? start + 7 : start;

            const all = currentDays.length + start;
            const end = 6 * 7 - all;

            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + 1);

            const previousDate = new Date();
            previousDate.setMonth(previousDate.getMonth() - 1);

            let nextDays = getAllDaysInMonth(nextDate.getFullYear(), nextDate.getMonth(), false);
            nextDays = nextDays.slice(0, end);

            let previousDays = getAllDaysInMonth(previousDate.getFullYear(), previousDate.getMonth(), false);
            previousDays = previousDays.slice(previousDays.length - start);

            dateElement.innerHTML = "";

            let days = [...previousDays, ...currentDays, ...nextDays];

            for (const day of days) {
                const element = document.createElement("div");
                const root = document.createElement("div");
                element.classList.add("date");
                if (!day.tag) {
                    element.classList.add("nodate");
                }
                this.checkIfCurrentDate(day.date) ? element.classList.add("currentDate") : "";
                element.textContent = day.date.getDate();
                root.classList.add("root");
                root.appendChild(element);
                dateElement.appendChild(root);

                root.addEventListener("click", (event) => {
                    if (event.target.classList.contains("root")) {
                        return;
                    }

                    if (this.rangeSelected) {
                        this.rangeSelected.forEach(item => {
                            item.classList.remove("rangeEnd");
                            item.classList.remove("rangeStart");
                            item.classList.remove("range");
                        });
                        this.rangeSelected = [];
                    }

                    if (this.currentSelect.length == 0) {
                        this.currentSelect.push(event.target);
                        event.target.classList.toggle("selected");
                    } else {
                        const index = this.currentSelect.indexOf(event.target);
                        if (index > -1) {
                            event.target.classList.toggle("selected");
                            this.currentSelect.splice(index, 1);
                        } else if (event.ctrlKey) {
                            event.target.classList.toggle("selected");
                            this.currentSelect.push(event.target);
                        } else if (event.shiftKey && this.currentSelect.length == 1) {
                            const dates = this.shadowRoot.querySelector(".dates");
                            let start = false;
                            for (const child of dates.children) {
                                if (start) {
                                    this.rangeSelected.push(child);
                                    if (child.children[0] === event.target || child.children[0] === this.currentSelect[0]) {
                                        start = false;
                                        child.classList.add("rangeEnd");
                                    } else {
                                        child.classList.add("range");
                                    }
                                } else {
                                    if (child.children[0] === event.target || child.children[0] === this.currentSelect[0]) {
                                        this.rangeSelected.push(child);
                                        child.classList.add("rangeStart");
                                        start = true;
                                    }
                                }
                            }
                            event.target.classList.toggle("selected");
                            this.currentSelect.push(event.target);
                        } else {
                            this.currentSelect.forEach(item => {
                                item.classList.toggle("selected");
                            });
                            this.currentSelect = [];
                            event.target.classList.toggle("selected");
                            this.currentSelect.push(event.target);
                        }
                    }

                    const selected = [];
                    this.currentSelect.forEach(item => selected.push(item.textContent));
                    const range = [];
                    this.rangeSelected.forEach(item => range.push(item.textContent));
                    this.selectedCallback(selected, range);
                });
            }
        }

        this.checkIfCurrentDate = (date) => {
            if (
                date.getDate() === new Date().getDate() &&
                date.getFullYear() === new Date().getFullYear() &&
                date.getMonth() === new Date().getMonth()
            ) {
                return true;
            } else {
                return false;
            }
        }

        this.selected = (callback) => {
            this.selectedCallback = callback;
        }

        function getAllDaysInMonth(year, month, tag) {
            const date = new Date(year, month, 1);

            const dates = [];

            while (date.getMonth() === month) {
                dates.push({ date: new Date(date), tag: tag });
                date.setDate(date.getDate() + 1);
            }

            return dates;
        }
    }
}