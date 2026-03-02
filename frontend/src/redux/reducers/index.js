import { combineReducers } from "redux";
import auth from "./authReducer";
import notify from "./notifyReducer";
import ico from "./icoReducer";
import icoid from "./idReducer";
import property from "./propertyReducer";

export default combineReducers({
	auth,
	notify,
	ico,
	icoid,
	property,
});
