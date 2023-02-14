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

        calendar.selected(({ selected, range, month, year, selectedElements, rangeElements }) => {
            const all = range.length ? range : selected;
            const rangeFlag = range.length ? true : false;

            all.forEach((item, index) => {
                if (!map.has(`${item} ${month} ${year}`)) {
                    const newAttendance = document.createElement("marble-repa-attendance");
                    map.set(`${item} ${month} ${year}`, newAttendance);

                    newAttendance.setAttribute("week", "None");
                    newAttendance.setAttribute("date", `${item}. ${monthNames[month]} ${year}`);
                    if(index != 0 && rangeFlag) {
                        newAttendance.setAttribute("noclose", "true");
                    }
                    mainElement.appendChild(newAttendance);

                    newAttendance.close(() => {
                        const all = rangeElements.length > 0 ? rangeElements : selectedElements;
                        const index = all.findIndex(allItem => allItem.textContent === item);

                        let target = all[index];
                        if(target.classList.contains("root")) {
                            target = target.children[0];
                        }

                        calendar.removeSelection({target});
                    });
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