import React from "react"

import { format, mouse, range, select } from "d3"

import BarGraph from "../../utils/BarGraph.react"
import Popup from "../../utils/Popup"

let numberFormat = format(",d"),
	decimalFormat = format(",.2f");

import { CENSUS_VARIABLES, SHEET_3_VARIABLES, SHEET_3_VARIABLE_NAMES } from "../../utils/CensusVariables"

const buildIncomeRows = data => {
	let rows = [];
	let i = 0;
	while ((i < data.length) && (i < 32)) {
		rows.push(
			<tr key={ i }>
				<td>{ SHEET_3_VARIABLE_NAMES[i] }</td>
				<td className="align-right">{ numberFormat(data[i]) }</td>
				<td className="align-right">{ numberFormat(data[i + 1]) }</td>
			</tr>
		)
		i += 2;
	}
	return rows;
}
const povertyTableTabs = [0, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1];
const buildPovertyStatusByHouseholdRows = data => {
	let rows = [],
		startIndex = 36,
		i = startIndex;
	 while ((i < data.length) && (i < 84)) {
	 	let index = Math.floor((i - startIndex) / 4),
	 		numTabs = povertyTableTabs[index];
		rows.push(
			<tr key={ i }>
				<td style={ { paddingLeft: (numTabs * 20) + "px" } }>{ SHEET_3_VARIABLE_NAMES[startIndex + index] }</td>
				<td className="align-right">{ numberFormat(data[i]) }</td>
				<td className="align-right">{ numberFormat(data[i + 1]) }</td>
				<td className="align-right">{ numberFormat(data[i + 2]) }</td>
				<td className="align-right">{ numberFormat(data[i + 3]) }</td>
				<td className="align-right">{ decimalFormat((data[i + 2] / data[i]) * 100) }%</td>
				<td className="align-right">{ decimalFormat((data[i + 3] / data[i]) * 100) }%</td>
			</tr>
		)
	 	i += 4;
	 }
	return rows;
}
const buildPovertyStatusByAgeRows = data => {
	let rows = [],
		startDataIndex = 84,
		i = startDataIndex,
		startNameIndex = 48;
	while (i < data.length) {
	 	let index = Math.floor((i - startDataIndex) / 4),
	 		shouldAddRows = index > 0,
	 		dataSlice = formatDataSlice(data.slice(i, i + 4), shouldAddRows),
	 		numTabs = index > 0 ? 1 : 0;
		rows.push(
			<tr key={ i }>
				<td style={ { paddingLeft: (numTabs * 20) + "px" } }>{ SHEET_3_VARIABLE_NAMES[startNameIndex + index] }</td>
				<td className="align-right">{ numberFormat(dataSlice[0]) }</td>
				<td className="align-right">{ numberFormat(dataSlice[1]) }</td>
				<td className="align-right">{ numberFormat(dataSlice[2]) }</td>
				<td className="align-right">{ numberFormat(dataSlice[3]) }</td>
				<td className="align-right">{ decimalFormat(dataSlice[4]) }%</td>
				<td className="align-right">{ decimalFormat(dataSlice[5]) }%</td>
			</tr>
		)
		i +=4;
	}
	return rows;
}
const formatDataSlice = (data, shouldAddRows) => {
	if (shouldAddRows) {
		data[0] = data[0] + data[2];
		data[1] = combineMoE(data);
	}
	data.push((data[2] / data[0]) * 100);
	data.push((data[3] / data[0]) * 100);
	return data;
}
const combineMoE = data => {
	let moeRatio1 = data[1] / data[0],
		moeRatio2 = data[3] / data[2],
		avgRatio = (moeRatio1 * data[0] + moeRatio2 * data[2]) / (data[0] + data[2]);
	return (data[0] + data[2]) * avgRatio;
}

export default class Sheet_3 extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			popup: Popup()
		}

		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.showPopup = this.showPopup.bind(this);
		this.movePopup = this.movePopup.bind(this);
		this.hidePopup = this.hidePopup.bind(this);
	}
	componentDidMount() {
		select("#graph-td")
			.on("mousemove", this.movePopup)
			.call(this.state.popup);
	}
	showPopup(d, i) {
		this.state.popup
			.data([
				[SHEET_3_VARIABLE_NAMES[i * 2]],
				["# of Persons", numberFormat(d[0])],
				["MoE", numberFormat(d[1])]
			])
			.show();
	}
	movePopup(e) {
		let pos = mouse(document.getElementById("graph-td"));
		this.state.popup.move(pos);
	}
	hidePopup() {
		this.state.popup.hide();
	}
	render() {
		let graphData = this.props.data.slice(0, 32).reduce((a, c, i) => { return (i % 2) === 0 ? [...a, [c]] : [...a.slice(0, a.length - 1), [...a[a.length - 1], c]]; }, []);
		return (
	         <div className="container-fluid content-container">
	            <div className="row">

	            	<div className="col-3" style={ { paddingLeft: "0px" } }>
		            	<table className="table table-sm table-striped">
		            		<thead className="thead-inverse">
		            			<tr>
		            				<th />
		            				<th className="align-right">Income</th>
		            				<th className="align-right">MoE</th>
		            			</tr>
		            		</thead>
		            		<tbody>
		            			<tr>
		            				<td>{ SHEET_3_VARIABLE_NAMES[34] }</td>
		            				<td className="align-right">${ numberFormat(this.props.data[34]) }</td>
		            				<td className="align-right">${ numberFormat(this.props.data[35]) }</td>
		            			</tr>
		            			<tr>
		            				<td>{ SHEET_3_VARIABLE_NAMES[32] }</td>
		            				<td className="align-right">${ numberFormat(this.props.data[32]) }</td>
		            				<td className="align-right">${ numberFormat(this.props.data[33]) }</td>
		            			</tr>
		            		</tbody>
		            	</table>
						<table className="table table-sm table-striped">
							<caption>
								Households by Income Range
							</caption>
							<thead className="thead-inverse">
								<tr>
									<th>Income Range</th>
									<th className="align-right">Households</th>
									<th className="align-right">MoE</th>
								</tr>
							</thead>
							<tbody>
								{
									buildIncomeRows(this.props.data)
								}
							</tbody>
						</table>
	            	</div>

	            	<div className="col-9">
						<div className="row">
			            	<div className="col-7" style={ { margin: "0px", paddingLeft: "0px" } }>
				            	<table className="table table-sm table-striped">
				            		<caption>Poverty Status by Household Type</caption>
				            		<thead className="thead-inverse">
				            			<tr>
				            				<th>Household Type</th>
				            				<th className="align-right">Total #</th>
				            				<th className="align-right">MoE</th>
				            				<th className="align-right"># Below</th>
				            				<th className="align-right">MoE</th>
				            				<th className="align-right">% Below</th>
				            				<th className="align-right">MoE</th>
				            			</tr>
				            		</thead>
				            		<tbody>
										{
											buildPovertyStatusByHouseholdRows(this.props.data)
										}
				            		</tbody>
				            	</table>
			            	</div>

			            	<div className="col-5" style={ { margin: "0px", paddingLeft: "0px" } }>
				            	<table className="table table-sm table-striped">
				            		<caption>Poverty Status by Age of Persons</caption>
				            		<thead className="thead-inverse">
				            			<tr>
				            				<th>Age Range</th>
				            				<th className="align-right">Total #</th>
				            				<th className="align-right">MoE</th>
				            				<th className="align-right"># Below</th>
				            				<th className="align-right">MoE</th>
				            				<th className="align-right">% Below</th>
				            				<th className="align-right">MoE</th>
				            			</tr>
				            		</thead>
				            		<tbody>
										{
											buildPovertyStatusByAgeRows(this.props.data)
										}
				            		</tbody>
				            	</table>
			            	</div>

			            	<div className="col-12" style={ { margin: "0px", paddingLeft: "0px" } }>
				            	<table className="table table-sm table-striped">
				            		<thead className="thead-inverse">
				            			<tr>
				            				<th>Households by Income Range</th>
				            			</tr>
				            		</thead>
				            		<tbody>
				            			<tr>
		            						<td style={ { padding: 0 } } id="graph-td">
		            							<BarGraph data={ graphData }
		            								height={ 250 }
		            								fill={ "#025aa5" }
		            								xAxis={ false }
		            								margin={ { left: 50, bottom: 20 } }
		            								onMouseover={ this.showPopup }
		            								onMouseout={ this.hidePopup }/>
		            						</td>
		            					</tr>
		            				</tbody>
				            	</table>
		            		</div>

	            		</div>
					</div>
		        </div>
		    </div>
		)
	}
}