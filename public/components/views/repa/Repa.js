import config from "../../../config.js";
import BaseComponent from "../../../source/BaseComponent.js";
import router from "../../../router.js";

export default class MarbleRepa extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Repa.css", import.meta.url);
        this.useTemplate("/components/views/repa/Repa.html");
    }

    load = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mainElement = this.shadowRoot.querySelector(".main");
        const calendar = this.shadowRoot.querySelector("marble-repa-calendar");
        let map = new Map();

        calendar.selected(({ selected, range, month, year }) => {
            const all = range.length ? range : selected;

            all.forEach(item => {
                if (!map.has(`${item} ${month} ${year}`)) {
                    const newAttendance = document.createElement("marble-repa-attendance");
                    map.set(`${item} ${month} ${year}`, newAttendance);
                    newAttendance.setAttribute("week", "None");
                    newAttendance.setAttribute("date", `${item}. ${monthNames[month]} ${year}`);
                    mainElement.appendChild(newAttendance);
                }
            });

            map.forEach((value, key) => {
                let found = false;

                all.forEach(item => {
                    if (key === `${item} ${month} ${year}`) {
                        found = true;
                    }
                });

                if (!found) {
                    mainElement.removeChild(value);
                    map.delete(key);
                }
            });
        })
    }
}