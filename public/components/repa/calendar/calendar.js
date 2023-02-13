import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaCalendar extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("calendar.css", import.meta.url);
        this.useTemplate("/components/repa/calendar/calendar.html");
        let currentSelect = [];
        let rangeSelected = [];
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
                element.classList.add("date");
                if (!day.tag) {
                    element.classList.add("nodate");
                }
                this.checkIfCurrentDate(day.date) ? element.classList.add("currentDate") : "";
                element.textContent = day.date.getDate();
                dateElement.appendChild(element);

                element.addEventListener("click", (event) => {
                    if(rangeSelected) {
                        rangeSelected.forEach(item => {
                            item.classList.remove("rangeEnd");
                            item.classList.remove("rangeStart");
                            item.classList.remove("range");
                        })
                    }

                    if(currentSelect.length == 0) {
                        currentSelect.push(event.target);
                        event.target.classList.toggle("selected");
                    }else {
                        const index = currentSelect.indexOf(event.target);
                        if(index > -1) {
                            event.target.classList.toggle("selected");
                            currentSelect.splice(index, 1);
                        }else if(event.ctrlKey) {
                            event.target.classList.toggle("selected");
                            currentSelect.push(event.target);
                        }else if(event.shiftKey && currentSelect.length == 1) {
                            const dates = this.shadowRoot.querySelector(".dates");
                            let start = false;
                            for(const child of dates.children) {
                                if(start) {
                                    rangeSelected.push(child);
                                    if(child === event.target || child === currentSelect[0]) {
                                        start = false;
                                        child.classList.add("rangeEnd");
                                    }else {
                                        child.classList.add("range");
                                    }
                                }else {
                                    if(child === event.target || child === currentSelect[0]) {
                                        rangeSelected.push(child);
                                        child.classList.add("rangeStart");
                                        start = true;
                                    }
                                }
                            }
                            event.target.classList.toggle("selected");
                            currentSelect.push(event.target);
                        }else {
                            currentSelect.forEach(item => {
                                item.classList.toggle("selected");
                            });
                            currentSelect = [];
                            event.target.classList.toggle("selected");
                            currentSelect.push(event.target);
                        }
                    }
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