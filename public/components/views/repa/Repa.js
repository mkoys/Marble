import BaseComponent from "../../../source/BaseComponent.js";


export default class MarbleRepa extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Repa.css", import.meta.url);
        this.useTemplate("/components/views/repa/Repa.html");
        this.map = new Map();
    }

    load = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mainElement = this.shadowRoot.querySelector(".main");
        const calendar = this.shadowRoot.querySelector("marble-repa-calendar");
        const alert = this.shadowRoot.querySelector(".alert");
        const save = alert.querySelector(".save");
        const discard = alert.querySelector(".discard");

        calendar.nextMonth = () => {
            this.map = new Map();
            mainElement.innerHTML = "";
        }

        calendar.change = ((selected) => {
            selected.forEach(item => {
                if (!this.map.has(`${item.day} ${item.month} ${item.year}`)) {
                    const newAttendance = document.createElement("marble-repa-attendance");
                    this.map.set(`${item.day} ${item.month} ${item.year}`, newAttendance);

                    newAttendance.setAttribute("week", "None");
                    newAttendance.setAttribute("date", `${item.day}. ${monthNames[item.month]} ${item.year}`);
                    mainElement.appendChild(newAttendance);

                    newAttendance.close(async () => {
                        this.map.delete(`${item.day} ${item.month} ${item.year}`);
                        newAttendance.remove();
                        calendar.open(item, false, false);
                    });
                }
            });
            this.checkMapped(selected);
        });

        this.checkMapped = (selected) => {
            this.map.forEach(async (item, key) => {
                if (selected.findIndex(value => key === `${value.day} ${value.month} ${value.year}`) == -1) {
                    item.remove();
                    this.map.delete(key);
                }
            })
        }
    }
}