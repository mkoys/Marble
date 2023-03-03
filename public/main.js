import router from "./router.js";
import ResourceMap from "./source/ResourceMap.js";
import MarbleLabelInput from "./components/labelInput/LabelInput.js";
import MarbleDropdown from "./components/dropdown/Dropdown.js";
import MarbleCheckbox from "./components/checkbox/Checkbox.js";
import MarbleTooltip from "./components/tooltip/Tooltip.js";

import MarbleLogin from "./components/views/Login.js";
import MarbleRegister from "./components/views/Register.js";

router();

customElements.define("marble-resources", ResourceMap);
customElements.define("marble-dropdown", MarbleDropdown);
customElements.define("marble-checkbox", MarbleCheckbox);
customElements.define("marble-tooltip", MarbleTooltip);
customElements.define("marble-labelinput", MarbleLabelInput);

customElements.define("marble-login", MarbleLogin);
customElements.define("marble-register", MarbleRegister);