import GlobalTypes from "./GlobalTypes";
import { postDataAPI } from "../../utils/API";
import swal from "sweetalert";
import axios from "axios";

export const PROPERTY_TYPES = {
	LOADING: "LOADING",
	CREATE_PROPERTY: "CREATE_PROPERTY",
	GET_PROPERTY: "GET_PROPERTY",
	ID: "ID",
	GET_COMPLETED: "GET_COMPLETED",
	GET_PROFILE: "GET_PROFILE",
	DEPLOY: "DEPLOY",
	CONTRACT_DETAIL: "CONTRACT_DETAIL",
};

export const createProperty = (data, images, deed) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("create_property",data);
		if(res.data.status==1){
			var formData = new FormData();
			let propertyId=res.data.Property._id;
            formData.append("propertyId", propertyId)
			images.forEach(img => {
                formData.append("images", img)
            })
			formData.append("deed", deed);
			const resp = await axios.post("/api/upload", formData, {
				headers: {
					"content-type": "multipart/form-data",
				},
			});
			let update={
				_id: propertyId,
				data: {
					imageName: resp.data.image_url,
					propertyDeed: resp.data.deed_url,
				}
			}
			await postDataAPI("updatePropertyFile",update);
		}
		dispatch({
			type: PROPERTY_TYPES.CREATE_PROPERTY,
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

export const editProperty = (data) => async (dispatch) => {
	try {
		dispatch({ type: GlobalTypes.NOTIFY, payload: { loading: true } });
		const res = await postDataAPI("update_property",data);
		if(res.data.status==1){
			swal("Success", "You have successfully Updated Property!", "success");
		}
		dispatch({
			type: PROPERTY_TYPES.CREATE_PROPERTY,
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

export const blankProperty = () => async (dispatch) => {
	dispatch({
		type: PROPERTY_TYPES.CREATE_PROPERTY,
		payload: {
			data: { status: 0, errors: {}},
		},
	});
};
