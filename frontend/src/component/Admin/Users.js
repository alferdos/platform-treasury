import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loading } from "../../redux/actions/authAction";
import { getDataAPI, postDataAPI } from "../../utils/API";
import { VIEW_CONTRACT } from "../../utils/config";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";

const Users = () => {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const [data, setData] = useState("");
	const [senderror, setSendError] = useState("");
	const [sendtrans, setSendTrans] = useState(0);
	const [open, setOpen] = React.useState(false);
	const [userid, setUserId] = useState("");
	const [balance, setBalance] = useState("");
	const handleClose = () => {
		setOpen(false);
	};

	async function getUser() {
		const res = await getDataAPI("/get_user?role=0");
		setData(res.data);
	}

	useEffect(() => {
		getUser();
	}, []);

	const sendToken = async (user_id) => {
		setUserId(user_id);
		getTransaction(user_id);
		setSendTrans(0);
		setOpen(true);
	};

	const deleteUser = async (user_id) => {
		swal({
			title: "Are you sure?",
			text: "You want to delete this record?",
			icon: "warning",
			buttons: [
			  'No',
			  'Yes'
			],
			dangerMode: true,
		}).then(async function(isConfirm) {
			if (isConfirm) {
				await postDataAPI("/delete_user", {user_id});
				getUser();
			}
		});
	};

	const getTransaction = async (userId) => {
		var getUserBalance = await getDataAPI("/getUserBalance/" + userId);
		setBalance(getUserBalance.data);
	}

	const sendTokenSubmit = async (e) => {
		e.preventDefault();
		dispatch(loading(true));
		const { units, propertyId, userId } = e.target.elements;
		let details = {
			units: units.value,
			propertyId: propertyId.value,
			userId: userId.value,
		};
		postDataAPI("sendTokenByAdmin", details).then(function (res) {
			dispatch(loading(false));
			let response = res.data;
			if(response.status==1){
				//setOpen(false);
				setSendTrans(response.tx.hash);
			}
			else{
				setSendError(response.errors);
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	};

	const bodyOpen = () => {
		return (
			<div className="paper">
				<div className="paper-head">
					<h2 className="paper_h2" id="simple-modal-title">
						Send Unit
					</h2>
					<span onClick={handleClose}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</span>
				</div>
				<div className="paper-inner">
				{(sendtrans)?
				(
					<div className="alert alert-success text-center">Unit send to user successfully. <br/>Click <a href={`${VIEW_CONTRACT}tx/${sendtrans}`} target="_blank">Here</a> for see the transaction!</div>
				):(
					<form onSubmit={sendTokenSubmit.bind(this)}>
						<input type="hidden" name="userId" value={userid}/>
						<div className="mb-3">
							<label>Select Property</label>
							<select className="form-control" name="propertyId">
								<option value="">--Select--</option>
								{
									balance? balance.map((b, i) => (
										<option key={i} value={b.propertyId._id}>{b.propertyId.title}</option>
									)): ""
								}
							</select>
							<span className="error">{senderror.propertyId}</span>
						</div>
						<div className="mb-3">
							<label>Enter Units</label>
							<input
								className="form-control"
								type="number"
								min="1"
								name="units"
							/>
							<span className="error">{senderror.units}</span>
						</div>
						<button className="btn btn-default">Send</button>
					</form>
				)}
				</div>
			</div>
		);
	};
	return (
		<div>
			<div className="main_content">
				<section className="listing_banner">
					<div className="container">
					<div className="table_scroll">
						<table className="table propertyListTable">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Image</th>
									<th scope="col">Name</th>
									<th scope="col">Email</th>
									<th scope="col">Phone</th>
									<th scope="col">Role</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
							{
								(data.length==0)?(<tr><td colSpan='100%'><center>Record is empty!</center></td></tr>):""
							}
							{data ? data.map((user, index) => (
								<tr key={index}>
									<td scope="row">{index+1}</td>
									<td><img src={`../profilePic/${user.profile_image}`} /></td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.phone_no}</td>
									<td>{(user.role)?( <>Admin</> ):( <>User</> )}</td>
									<td className="btn_div">
										<button className="btn send1  btn-default" onClick={()=>sendToken(user._id)}>Send Units</button>
										<button className="btn del1  btn-default" onClick={()=>deleteUser(user._id)}>Delete</button>
									</td>
								</tr>
							)) : ""}
							</tbody>
						</table>
						</div>
					</div>
				</section>
				<div>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description">
						{bodyOpen()}
					</Modal>
				</div>
			</div>
		</div>
	);
};

export default Users;
