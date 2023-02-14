import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaAttendance extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("attendance.css", import.meta.url);
        this.useTemplate("/components/repa/attendance/attendance.html");
    }
}