import BaseComponent from "../../../source/BaseComponent.js";


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
        const alert = this.shadowRoot.querySelector(".alert");
        const save = alert.querySelector(".save");
        const discard = alert.querySelector(".discard");
        let map = new Map();

        calendar.changeCallback = () => {
            map = new Map();
            mainElement.innerHTML = "";
        }

        calendar.selected(async ({ selected, range, month, year, selectedElements, rangeElements }) => {
            const all = range.length ? range : selected;
            const rangeFlag = range.length ? true : false;
            for (let index = 0; index < all.length; index++) {
                const item = all[index];
                if (!map.has(`${item} ${month} ${year}`)) {
                    const newAttendance = document.createElement("marble-repa-attendance");
                    map.set(`${item} ${month} ${year}`, newAttendance);

                    newAttendance.setAttribute("week", "None");
                    newAttendance.setAttribute("date", `${item}. ${monthNames[month]} ${year}`);
                    mainElement.appendChild(newAttendance);

                    newAttendance.close(async () => {
                        const all = rangeElements.length > 0 ? rangeElements : selectedElements;
                        const index = all.findIndex(allItem => allItem.textContent === item);

                        let target = all[index];
                        if (target.classList.contains("root")) {
                            target = target.children[0];
                        }

                        calendar.removeSelection({ target });
                    });
                }
            }

            let rangeCloseDone = true;
            let last = null;
            map.forEach(async (value, key) => {
                last = value;
                let found = false;

                all.forEach(item => {
                    if (key === `${item} ${month} ${year}`) {
                        found = true;
                    }
                });


                if (!rangeCloseDone && rangeFlag) {
                    value.setAttribute("noclose", "true");
                    //value.setAttribute("nobutton", "true");
                } else if (rangeFlag) {
                    rangeCloseDone = false;
                }

                if (!found) {
                    const attendance = value.data();

                    if (attendance.content.length) {
                        alert.classList.remove("closed");
                        await new Promise((resolve, reject) => {
                            const resolveRequest = () => { 
                                save.removeEventListener("click", resolveRequest);
                                discard.removeEventListener("click", rejectRequest);
                                calendar.clickDate(value.getAttribute("date"));
                                resolve() 
                            }
                            const rejectRequest = () => { 
                                console.log(value);
                                mainElement.removeChild(value);
                                map.delete(key);
                                save.removeEventListener("click", resolveRequest);
                                discard.removeEventListener("click", rejectRequest);
                                resolve() 
                            }
                            save.addEventListener("click", resolveRequest);
                            discard.addEventListener("click", rejectRequest);
                        })
                        alert.classList.add("closed");
                    }else {
                        mainElement.removeChild(value);
                        map.delete(key);
                    }

                }
            });
        });
    }
}