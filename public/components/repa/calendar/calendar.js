import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaCalendar extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("calendar.css", import.meta.url);
        this.useTemplate("/components/repa/calendar/calendar.html");
    }
}