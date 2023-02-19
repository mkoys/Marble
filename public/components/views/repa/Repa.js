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
        let attendanceClose = false;

        calendar.nextMonth = () => {
            this.map = new Map();
            mainElement.innerHTML = "";
        }

        this.closing = async (value) => {
            const alertText = alert.querySelector(".alertHeaderText");
            
            let final = [];
            
            if (Array.isArray(value)) {
                final = value;
                if (value.length == 1) {
                    alertText.textContent = `Close ${value[0].day}. ${monthNames[value[0].month]} ${value[0].year} card?`
                } else {
                    alertText.textContent = `Close all cards?`
                }
            } else if (value) {
                final.push(value);
                alertText.textContent = `Close ${value.day}. ${monthNames[value.month]} ${value.year} card?`
            };
            
            let prompt = false;

            for (let index = 0; index < mainElement.children.length; index++) {
                const element = mainElement.children[index];
                const indexFinal = final.findIndex(value => element.getAttribute("date") === `${value.day}. ${monthNames[value.month]} ${value.year}`)
                if(indexFinal > -1) {
                   const data = element.data();
                    if(data.content.length > 0) {
                        prompt = true;
                    }
                }
            }

            if (prompt) {
                alert.classList.remove("closed");
                const result = await new Promise(resolve => {
                    function yes() {
                        alert.classList.add("closed");
                        save.removeEventListener("click", yes);
                        discard.removeEventListener("click", no);
                        resolve(false);
                    }
                    function no() {
                        alert.classList.add("closed");
                        save.removeEventListener("click", yes);
                        discard.removeEventListener("click", no);
                        resolve(true);
                    }
                    save.addEventListener("click", yes);
                    discard.addEventListener("click", no);
                });
                
                return result;
            } else {
                return true;
            }

        }

        calendar.change = ((selected, range) => {
            selected.forEach((item, itemIndex) => {
                if (!this.map.has(`${item.day} ${item.month} ${item.year}`)) {
                    const newAttendance = document.createElement("marble-repa-attendance");
                    this.map.set(`${item.day} ${item.month} ${item.year}`, newAttendance);

                    newAttendance.setAttribute("week", "None");
                    newAttendance.setAttribute("date", `${item.day}. ${monthNames[item.month]} ${item.year}`);
                    mainElement.appendChild(newAttendance);

                    newAttendance.close(async () => {
                        calendar.open(item, false, false);
                    });
                }
            });
            this.checkMapped(selected, range);
        });

        calendar.close = async (value, close) => {
            const result = await this.closing(value);
            if (result) {
                close();
                this.checkMapped(calendar.selected, calendar.range)
            }
        }

        this.checkMapped = (selected, range = false) => {
            let index = 0;
            this.map.forEach(async (item, key) => {
                if (range && index !== 0) {
                    item.setAttribute("noclose", "true")
                }

                if (selected.findIndex(value => key === `${value.day} ${value.month} ${value.year}`) == -1) {
                    item.remove();
                    this.map.delete(key);
                }

                index++;
            });
        }
    }
}