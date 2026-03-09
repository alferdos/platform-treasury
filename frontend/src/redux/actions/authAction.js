import { postDataAPI } from "../../utils/API";
import swal from "sweetalert";
import { postDataAPIBare } from "../../utils/API";
import GlobalTypes from "./GlobalTypes";

export const register = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("register", data);
		if(res.data.status === 1){
			swal("Success", "You have successfully Registered", "success");
		}
		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err,
			},
		});
	}
};

export const login = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("login", data);
		if(res.data.status === 1){
			swal("Success", "You have successfully Login", "success");
		}
		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				// error: err.response.data.msg,
			},
		});
	}
};

export const adminLogin = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("admin/login", data);
		if(res.data.status === 1){
			swal("Success", "You have been logged in successfully.", "success");
		}
		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				// error: err.response.data.msg,
			},
		});
	}
};

export const refreshToken = () => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("refresh_token");
		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err,
			},
		});
	}
};

export const forgot_password = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPIBare("forgot_password", data);

		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err.response.data.msg,
			},
		});
	}
};

export const updateProfile = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPIBare("update_profile", data);

		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err.response.data.msg,
			},
		});
	}
};

export const updateProfilePic = (data) => async (dispatch, getState) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPIBare("update_profilePic", data);
		
		let response = res.data;
		if (response.status == 1) {
			swal("Success", "Profile image updated successfully!", "success");
			// Merge the new profile_image into the existing auth.data state
			const currentAuth = getState().auth;
			const newProfileImage = response.data?.profile_image;
			if (newProfileImage && currentAuth.data) {
				dispatch({
					type: GlobalTypes.AUTH,
					payload: {
						...currentAuth,
						data: {
							...currentAuth.data,
							user: {
								...currentAuth.data.user,
								profile_image: newProfileImage,
							},
						},
					},
				});
			}
		}
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err?.response?.data?.msg || 'Upload failed',
			},
		});
	}
};

export const logout = () => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("logout");
		dispatch({
			type: GlobalTypes.AUTH,
			payload: {
				data: res.data,
			},
		});
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: false } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err,
			},
		});
	}
};

export const loading = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: data } });
	} catch (err) {
		dispatch({
			type: GlobalTypes.NOTIFY,
			payload: {
				error: err.response.data.msg,
			},
		});
	}
};