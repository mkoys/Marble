import BaseComponent from "../../../source/BaseComponent.js";


export default class MarbleRepa extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("Repa.css", import.meta.url);
        this.useTemplate("/components/views/repa/Repa.html");
        this.map = new Map();
    }

    load = async () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mainElement = this.shadowRoot.querySelector(".main");
        const calendar = this.shadowRoot.querySelector("marble-repa-calendar");
        const alert = this.shadowRoot.querySelector(".alert");
        const closeAlert = alert.querySelector(".close");
        const save = alert.querySelector(".save");
        const discard = alert.querySelector(".discard");

        const monthFilter = { date: { month: calendar.currentDate.getMonth(), year: calendar.currentDate.getFullYear() } }

        const dataForMonth = await fetch("http://localhost:8000/repa/read", {
            method: "POST",
            body: JSON.stringify(monthFilter),
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        this.data = await dataForMonth.json();

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
                const splitDate = element.getAttribute("date").split(" ");
                const indexFound = this.data.findIndex(value => value.date.day == parseInt(splitDate[0].slice(0, splitDate[0].length - 1)) && value.date.month == parseInt(monthNames.indexOf(splitDate[1])) && value.date.year == parseInt(splitDate[2]))
                if (indexFound > -1) {
                    const currentData = this.data[indexFound];
                    const inputs = element.shadowRoot.querySelectorAll(".boxInput");
                    for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
                        const input = inputs[inputIndex];
                        let descriptionElement = input.querySelector(".description");
                        let timeElement = input.querySelector(".time");
                        let classTypeElement = input.querySelector(".class");

                        let description = descriptionElement.value;
                        let time = timeElement.value;
                        let classType = classTypeElement.value;

                        if (description === "") { description = currentData.content[inputIndex]?.description }
                        if (time === "") { time = currentData.content[inputIndex]?.time }
                        if (classType === "") { classType = currentData.content[inputIndex]?.classType }
                        if (
                            currentData.content[inputIndex]?.description !== description ||
                            currentData.content[inputIndex]?.time !== time ||
                            currentData.content[inputIndex]?.classType !== classType
                        ) {
                            console.log(currentData.content[inputIndex]?.description, description);
                            console.log(currentData.content[inputIndex]?.time, time);
                            console.log(currentData.content[inputIndex]?.classType, classType);
                            prompt = true;
                        }
                    }
                } else if (indexFinal > -1) {
                    const data = element.data();
                    console.log(this.data);
                    if (data.content.length > 0) {
                        prompt = true;
                    }
                }
            }

            if (prompt) {
                setTimeout(() => { alert.style.opacity = 1 }, 50);
                alert.classList.remove("closed");
                const result = await new Promise(resolve => {
                    const yes = () => {
                        alert.style.opacity = 1;
                        alert.classList.add("closed");
                        save.removeEventListener("click", nosave);
                        closeAlert.removeEventListener("click", yes);
                        discard.removeEventListener("click", no);
                        resolve(false);
                    }
                    const no = () => {
                        alert.style.opacity = 0;
                        alert.classList.add("closed");
                        save.removeEventListener("click", nosave);
                        closeAlert.removeEventListener("click", yes);
                        discard.removeEventListener("click", no);
                        resolve(true);
                    }

                    const nosave = async () => {
                        alert.style.opacity = 0;
                        alert.classList.add("closed");
                        save.removeEventListener("click", nosave);
                        closeAlert.removeEventListener("click", yes);
                        discard.removeEventListener("click", no);
                        this.map.forEach(async value => {
                            const data = value.data();

                            await fetch("http://localhost:8000/repa/insert", {
                                method: "POST",
                                body: JSON.stringify(data),
                                headers: { authorization: "Bearer " + localStorage.getItem("token") }
                            });
                        });

                        setTimeout(async () => {
                            const monthFilter = { date: { month: calendar.currentDate.getMonth(), year: calendar.currentDate.getFullYear() } }

                            const dataForMonth = await fetch("http://localhost:8000/repa/read", {
                                method: "POST",
                                body: JSON.stringify(monthFilter),
                                headers: {
                                    authorization: "Bearer " + localStorage.getItem("token")
                                }
                            });

                            this.data = await dataForMonth.json();
                            calendar.update();
                        }, 100);
                        resolve(true);
                    }
                    closeAlert.addEventListener("click", yes);
                    save.addEventListener("click", nosave);
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
                    const foundIndex = this.data.findIndex(value => value.date.day == parseInt(item.day) && value.date.month == parseInt(item.month) && value.date.year == parseInt(item.year));
                    if (foundIndex > -1) {
                        newAttendance.message = this.data[foundIndex];
                        newAttendance.setAttribute("status", "✓ Saved");
                        newAttendance.setAttribute("statusColor", "var(--secondary-color)");
                    } else {
                        newAttendance.setAttribute("status", "✗ Unsaved");
                    }
                    newAttendance.setAttribute("date", `${item.day}. ${monthNames[item.month]} ${item.year}`);
                    mainElement.appendChild(newAttendance);

                    newAttendance.save(async () => {
                        setTimeout(async () => {
                            const monthFilter = { date: { month: calendar.currentDate.getMonth(), year: calendar.currentDate.getFullYear() } }

                            const dataForMonth = await fetch("http://localhost:8000/repa/read", {
                                method: "POST",
                                body: JSON.stringify(monthFilter),
                                headers: {
                                    authorization: "Bearer " + localStorage.getItem("token")
                                }
                            });

                            this.data = await dataForMonth.json();
                            calendar.update();
                        }, 100);
                    });

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