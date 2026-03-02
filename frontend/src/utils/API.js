import axios from "axios";
//here consuming API from backend
export const getDataAPIbyId = async (url, id) => {
	const res = await axios.get(`/api/${url}/${id}`);
	return res;
};
export const getDataAPI = async (url) => {
	const res = await axios.get(`/api/${url}`);
	return res;
};

export const postDataAPI = async (url, post, unit) => {
	const res = await axios.post(`/api/${url}`, post, {
		headers: { Authorization: unit },
	});
	return res;
};
export const postDataAPIBare = async (url, post) => {
	const res = await axios.post(`/api/${url}`, post);
	return res;
};
export const putDataAPI = async (url, post) => {
	const res = await axios.put(`/api/${url}`, post);
	return res;
};
