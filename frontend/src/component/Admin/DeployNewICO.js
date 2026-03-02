import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { deploynewcontract } from "../../redux/actions/icoAction";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI, postDataAPI } from "../../utils/API";
import { VIEW_CONTRACT } from "../../utils/config";

const DeployNewICO = (property) => {
	const dispatch = useDispatch();
	let tx=0;
	const { auth, ico } = useSelector((state) => state);
	if (ico.data) {
		var response = ico.data;
		if (response.status == 1) {
			response.errors= 0;
			tx=response.receipt;
		  	//swal("Success", "You have successfully Created Contract", "success");
		}
	}
	const handleDeploy = (e) => {
		e.preventDefault();
		const { contractName, symbol, totalsupply } = e.target.elements;
		let contractData = {
			propertyId: property.data._id,
			contractName: contractName.value,
			symbol: symbol.value,
			totalsupply: totalsupply.value,
		};
		dispatch(deploynewcontract(contractData, auth));
	};
	return (
		<div className="create">
			<form onSubmit={(e) => handleDeploy(e)}>
				<div className="mb-3">
					<label className="form-label">Property Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Property Name"
						value={(property.data)?property.data.title:""}
						name="contractName"
						readonly
					/> 
					<span className="error">{ico.data ? ico.data.errors.contractName : ""}</span>
				</div>
				<div className="mb-3">
					<label className="form-label">Property Symbol</label>
					<input
						type="text"
						className="form-control"
						placeholder="Property Symbol"
						name="symbol"
					/>
					<span className="error">{ico.data ? ico.data.errors.symbol : ""}</span>
				</div>
				<div className="mb-3">
					<label className="form-label">Total Supply</label>
					<input
						type="text"
						className="form-control"
						placeholder="Total Supply"
						name="totalsupply"
					/>
					<span className="error">{ico.data ? ico.data.errors.totalsupply : ""}</span>
				</div>
				<div className="mb-3">
					<button type="submit" className="btn">
						Deploy Property
					</button>
				</div>
			</form>
		</div>
	);
};

export default DeployNewICO;
