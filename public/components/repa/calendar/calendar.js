import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaCalendar extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("calendar.css", import.meta.url);
        this.useTemplate("/components/repa/calendar/calendar.html");

        this.currentDate = new Date();
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        this.nextMonth = () => { }
        this.change = () => { }
        this.close = () => { }
        this.selected = [];
        this.range = false;

        this.load = () => {
            const nextElement = this.shadowRoot.querySelector(".next");
            const backElement = this.shadowRoot.querySelector(".back");

            nextElement.addEventListener("click", () => {
                this.range = false;
                this.selected = [];
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar(this.currentDate);
                this.nextMonth();
            });

            backElement.addEventListener("click", () => {
                this.range = false;
                this.selected = [];
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar(this.currentDate);
                this.nextMonth();
            });

            this.renderCalendar(this.currentDate);
        }

        this.open = (date, multiple = false, scope = false, trigger = true) => {
            const dateElement = this.shadowRoot.querySelector(".dates"); // Dates root

            let found = null;
            let foundIndex = null;

            for (let index = 0; index < dateElement.children.length; index++) {
                const element = dateElement.children[index];

                if (element.textContent == date.day && !element.children[0].classList.contains("nodate")) {
                    found = element;
                    foundIndex = index;
                }
            }

            if (found) {
                if (this.selected.length == 0) {
                    found.children[0].classList.add("selected");
                    this.selected.push(date);
                } else if (this.range) {
                    this.close(this.selected, () => {
                        this.range = false;
                        this.selected = [];

                        for (const child of dateElement.children) {
                            child.classList.remove("range", "rangeStart", "rangeEnd");
                            child.children[0].classList.remove("selected");
                        }
                    });
                } else if (found.children[0].classList.contains("selected")) {
                    this.close(this.selected[this.selected.findIndex(value => value.day === date.day)], () => {
                        found.children[0].classList.remove("selected");
                        const dateIndex = this.selected.findIndex(value => value.day === date.day);
                        this.selected.splice(dateIndex, dateIndex > -1 ? 1 : 0);
                    });
                } else if (multiple) {
                    found.children[0].classList.add("selected");
                    this.selected.push(date);
                } else if (scope) {
                    if (this.selected.length > 1) {
                        this.close(this.selected, () => {
                            this.range = false;
                            this.selected = [];

                            for (const child of dateElement.children) {
                                child.classList.remove("range", "rangeStart", "rangeEnd");
                                child.children[0].classList.remove("selected");
                            }
                        });
                    } else {
                        this.range = true;

                        const beforeIndex = foundIndex;
                        let nextIndex = null;
                        let rangeElements = [];

                        for (let index = 0; index < dateElement.children.length; index++) {
                            const element = dateElement.children[index];
                            if (element.textContent == this.selected[0].day && !element.children[0].classList.contains("nodate")) {
                                nextIndex = index;
                            }
                        }

                        let startIndex = nextIndex < beforeIndex ? nextIndex : beforeIndex;
                        let endIndex = (nextIndex < beforeIndex ? beforeIndex : nextIndex) + 1;

                        for (let index = startIndex; index < endIndex; index++) {
                            const element = dateElement.children[index];
                            rangeElements.push(element);
                        }
                        this.selected = [];

                        for (let index = 0; index < rangeElements.length; index++) {
                            const element = rangeElements[index];
                            this.selected.push({ day: element.textContent, month: date.month, year: date.year });

                            if (index == 0) {
                                element.classList.add("rangeStart");
                                element.children[0].classList.add("selected");
                            } else if (index == rangeElements.length - 1) {
                                element.classList.add("rangeEnd");
                                element.children[0].classList.add("selected");
                            } else {
                                element.classList.add("range");
                            }
                        }
                    }
                } else {
                    this.close(this.selected, () => {
                        this.range = false;
                        this.selected = [];

                        for (const child of dateElement.children) {
                            child.classList.remove("range", "rangeStart", "rangeEnd");
                            child.children[0].classList.remove("selected");
                        }
                        this.open(date, false, false);
                    });
                }

                if (trigger) {
                    this.change(this.selected, this.range);
                }
            }
        }

        this.renderCalendar = (date) => {
            const dateElement = this.shadowRoot.querySelector(".dates"); // Dates root
            const dateTextElement = this.shadowRoot.querySelector(".currentText"); // Date text

            // Set date text
            dateTextElement.textContent = `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`

            // Get days for current set month with tag
            const currentDays = getAllDaysInMonth(date.getFullYear(), date.getMonth(), true);

            // Get offset for right day start
            let start = currentDays[0].date.getDay() - 1;
            start = start < 0 ? start + 7 : start; // Overflow protection

            // Length of days with offset
            const all = currentDays.length + start;
            // Left days to fill
            const end = 6 * 7 - all;

            // Next days after month date
            const nextDate = new Date(date);
            nextDate.setMonth(nextDate.getMonth() + 1);
            // No tag in days generated
            let nextDays = getAllDaysInMonth(nextDate.getFullYear(), nextDate.getMonth(), false);
            nextDays = nextDays.slice(0, end);

            // Next days before month date
            const previousDate = new Date(date);
            previousDate.setMonth(previousDate.getMonth() - 1);
            // Next days after month date
            let previousDays = getAllDaysInMonth(previousDate.getFullYear(), previousDate.getMonth(), false);
            previousDays = previousDays.slice(previousDays.length - start);

            // Remove all dates from date element
            dateElement.innerHTML = "";

            // Concat all days together
            let days = [...previousDays, ...currentDays, ...nextDays];

            // Loop all days
            for (const day of days) {
                const root = document.createElement("div"); // Date element root
                const element = document.createElement("div"); // Number element

                root.classList.add("root"); // Root base class
                element.classList.add("date"); // Date base class
                // If no tag set nodate class
                if (!day.tag) { element.classList.add("nodate") }
                // Add current date class
                if (this.checkIfCurrentDate(day.date)) { element.classList.add("currentDate") };

                // Set text for date
                element.textContent = day.date.getDate();

                // Add text to root
                root.appendChild(element);
                // Add root to date
                dateElement.appendChild(root);

                // If has tag add click event listener
                if (day.tag) {
                    root.addEventListener("click", (event) => {
                        this.open({ day: event.target.textContent, month: date.getMonth(), year: date.getFullYear() }, event.ctrlKey, event.shiftKey);
                    });
                }
            }
        }

        // Checks if date is current date
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

        // Returns all dats in set year with set tag
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