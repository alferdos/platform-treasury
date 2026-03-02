import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loading } from "../../redux/actions/authAction";
import { getDataAPI, postDataAPI } from "../../utils/API";
import { VIEW_CONTRACT } from "../../utils/config";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";

const RequestFund = () => {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const [data, setData] = useState("");

	async function getRequestFund() {
		const res = await getDataAPI("/getRequestFund");
		setData(res.data);
	}

	useEffect(() => {
		getRequestFund();
	}, []);

	const approveRequest = async (requestId) => {
		swal({
			title: "Are you sure?",
			text: "You want to approve this fund?",
			icon: "warning",
			buttons: [
			  'No',
			  'Yes'
			],
			dangerMode: true,
		}).then(async function(isConfirm) {
			if (isConfirm) {
				postDataAPI("approveRequest", {requestId}).then(function(res){
					getRequestFund();
				});
			}
		});
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
									<th scope="col">User Name</th>
									<th scope="col">Amount</th>
									<th scope="col">Invoice</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
							{
								(data.length==0)?(<tr><td colSpan='100%'><center>Record is empty!</center></td></tr>):""
							}
							{data ? data.map((request, index) => (
								<tr key={index}>
									<td scope="row">{index+1}</td>
									<td>{request.userId.name}</td>
									<td>{request.amount}</td>
									<td><a href={`/invoice/${request.invoice}`} className="btn btn-default" target="_blank">View Invoice</a></td>
									<td className="btn_div">
									{
										(request.isApproved==false)?(<button className="btn send1 btn-default" onClick={()=>approveRequest(request._id)}>Approve</button>):""
									}
									</td>
								</tr>
							)) : ""}
							</tbody>
						</table>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default RequestFund;
