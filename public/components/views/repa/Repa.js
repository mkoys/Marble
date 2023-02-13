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
        const calendar = this.shadowRoot.querySelector("marble-repa-calendar");

        calendar.selected((selected, range) => {
            console.log(selected, range);
        })
    }
}