import router from "./router.js";

import MarbleLabelInput from "./components/labelInput/LabelInput.js";
import MarbleDropdown from "./components/dropdown/Dropdown.js";
import MarbleCheckbox from "./components/checkbox/Checkbox.js";

import MarbleLogin from "./components/views/Login.js";
import MarbleRegister from "./components/views/Register.js";

router();

customElements.define("marble-dropdown", MarbleDropdown);
customElements.define("marble-checkbox", MarbleCheckbox);
customElements.define("marble-labelinput", MarbleLabelInput);
customElements.define("marble-login", MarbleLogin);
customElements.define("marble-register", MarbleRegister);