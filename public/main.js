import router from "./router.js";

import MarbleLabelInput from "./components/labelInput/LabelInput.js";
import MarbleDropdown from "./components/dropdown/Dropdown.js";
import MarbleCheckbox from "./components/checkbox/Checkbox.js";
import MarbleTooltip from "./components/tooltip/Tooltip.js";

import MarbleLogin from "./components/views/Login.js";
import MarbleRegister from "./components/views/Register.js";

import RepaUserCard from "./components/repa/userCard/userCard.js";
import RepaCalendar from "./components/repa/calendar/calendar.js";
import RepaAttendance from "./components/repa/attendance/attendance.js";

import MarbleRepa from "./components/views/repa/Repa.js";

router();

customElements.define("marble-dropdown", MarbleDropdown);
customElements.define("marble-checkbox", MarbleCheckbox);
customElements.define("marble-tooltip", MarbleTooltip);
customElements.define("marble-labelinput", MarbleLabelInput);

customElements.define("marble-login", MarbleLogin);
customElements.define("marble-register", MarbleRegister);

customElements.define("marble-repa-usercard", RepaUserCard);
customElements.define("marble-repa-calendar", RepaCalendar);
customElements.define("marble-repa-attendance", RepaAttendance);
customElements.define("marble-repa", MarbleRepa);