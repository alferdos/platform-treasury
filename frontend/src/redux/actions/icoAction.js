import GlobalTypes from "./GlobalTypes";
import { postDataAPI } from "../../utils/API";

export const ICO_TYPES = {
	LOADING: "LOADING",
	CREATE_ICO: "CREATE_ICO",
	GET_ICO: "GET_ICO",
	ID: "ID",
	GET_COMPLETED: "GET_COMPLETED",
	GET_PROFILE: "GET_PROFILE",
	DEPLOY: "DEPLOY",
	CONTRACT_DETAIL: "CONTRACT_DETAIL",
};

export const deploynewcontract = (data, auth) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("deploy", data);

		dispatch({
			type: ICO_TYPES.DEPLOY,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		if (err && err.response && err.response.data) {
			dispatch({
				type: GlobalTypes.NOTIFY,
				payload: {
					// error: err.response.data.msg,
				},
			});
		}
	}
};
