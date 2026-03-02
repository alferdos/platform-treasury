import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loading } from "../../redux/actions/authAction";
import { getDataAPI, postDataAPI } from "../../utils/API";

const BlockchainData = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState("");
	const [searchDate, setSearchDate] = useState("");
	async function getBlockchainData() {
		const res = await postDataAPI("/cronJobFetchRecord");
		if(res.data.data){
			setSearchDate(document.getElementById("dateFilter").value);
			setData(res.data.data);
		}
		dispatch(loading(false));
	}
	useEffect(() => {
		dispatch(loading(true));
		getBlockchainData();
	}, []);
	
	const filterByDate = async () => {
		dispatch(loading(true));
		let date = (document.getElementById("dateFilter").value).split("-");
		date=parseInt(date[2]+parseInt(date[1])+date[0]);
		await postDataAPI("/cronJobSearchRecord", {date});
		getBlockchainData();
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
									<th scope="col" colspan="4"><input type="date" id="dateFilter" className="form-control"/></th>
									<th scope="col"><button className="btn send1 btn-default" onClick={()=>filterByDate()}>Filter By Date</button></th>
								</tr>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Address</th>
									<th scope="col">PropertyName</th>
									<th scope="col">Amount</th>
									<th scope="col">Date</th>
								</tr>
							</thead>
							<tbody>
							{
								(data.length==0)?(<tr><td colSpan='100%'><center>Record is empty!</center></td></tr>):""
							}
							{data ? data.map((d, index) => (
								<tr key={index}>
									<td scope="row">{index+1}</td>
									<td>{d[0]}</td>
									<td>{d[2]}</td>
									<td>{Number(d[3].hex)}</td>
									<td>{searchDate}</td>
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

export default BlockchainData;
