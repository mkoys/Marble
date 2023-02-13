import BaseComponent from "../../../source/BaseComponent.js";

export default class RepaUserCard extends BaseComponent {
    constructor() {
        super();
        this.addStyle("reset.css");
        this.addStyle("userCard.css", import.meta.url);
        this.useTemplate("/components/repa/userCard/userCard.html");
    }
}