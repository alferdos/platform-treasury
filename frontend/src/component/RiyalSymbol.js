import React from "react";

// Reusable Saudi Riyal currency symbol component using SVG
// SVG has no background - scales perfectly at any size and on any background
const RiyalSymbol = ({ size = "1.1em" }) => (
	<img
		src="/img/riyal_symbol.svg"
		alt="SAR"
		style={{
			height: size,
			width: "auto",
			display: "inline-block",
			verticalAlign: "middle",
			marginRight: "3px",
			marginBottom: "1px",
		}}
	/>
);

export default RiyalSymbol;
