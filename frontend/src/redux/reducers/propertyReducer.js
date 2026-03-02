import { PROPERTY_TYPES } from "../actions/propertyAction";

const initialState = {
	loading: false,
};

const propertyReducer = (state = initialState, action) => {
	switch (action.type) {
		case PROPERTY_TYPES.CREATE_PROPERTY:
			return action.payload;
		default:
			return state;
	}
};

export default propertyReducer;
