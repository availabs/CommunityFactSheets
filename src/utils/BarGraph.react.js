import React from "react"
import * as d3 from "d3"

let UNIQUE_GRAPH_ID = 0;
const newGraphId = () => {
	return "graph-" + (++UNIQUE_GRAPH_ID);
}

const DEFAULT_MARGIN = { left: 30, top: 20, right: 20, bottom: 30 };

export default class BarGraph extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			xScale: d3.scaleBand(),
			yScale: d3.scaleLinear()
		}
		if (props.xAxis) {
			this.state.xAxis = d3.axisBottom()
				.tickSizeInner(3)
				.tickSizeOuter(0)
				.scale(this.state.xScale);
		}

		this.state.yAxis = d3.axisLeft()
			.tickSizeInner(3)
			.tickSizeOuter(0)
			.scale(this.state.yScale);

		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
		this.updateGraph = this.updateGraph.bind(this);
	}
	componentDidMount() {
		let element = document.getElementById(this.props.id),
			rect = element.getBoundingClientRect();
	}
	componentDidUpdate(oldProps, oldState) {
		this.updateGraph();
	}
	updateGraph() {
		const STATE = this.state,
			PROPS = this.props;

		let element = document.getElementById(this.props.id),
			rect = element.getBoundingClientRect();

		let margin = Object.assign({}, DEFAULT_MARGIN, PROPS.margin);

		const width = rect.width - margin.left - margin.right,
			height = rect.height - margin.top - margin.bottom;

		STATE.xScale
			.paddingInner(PROPS.xPadding[0])
			.paddingOuter(PROPS.xPadding[1])
			.domain(PROPS.data.map((d, i) => i))
			.range([0, width]);
		STATE.yScale.domain([ 0, d3.max(PROPS.data, d => d[0])])
			.range([height, 0]);

		let svg = d3.select("#"+PROPS.id),
			graphArea = svg.select(".graph-area");

		graphArea.attr("transform", `translate(${ margin.left }, ${ margin.top })`);

		if (PROPS.xAxis) {
			svg.select(".x.axis")
				.attr("transform", `translate(${ margin.left }, ${ height + margin.top })`)
				.transition().call(STATE.xAxis);
		}
		if (PROPS.yAxis) {
			svg.select(".y.axis")
				.attr("transform", `translate(${ margin.left }, ${ margin.top })`)
				.transition().call(STATE.yAxis);
		}

		let rects = graphArea.selectAll(".graph-rect").data(PROPS.data);

		rects.exit().remove();

		rects.enter().append("rect")
			.attr("x", function(d, i) { return STATE.xScale(i); })
			.attr("y", height)
			.attr("height", 0)
			.attr("width", STATE.xScale.bandwidth())
			.attr("class", "graph-rect")
			.on("mouseover", PROPS.onMouseover)
			.on("mouseout", PROPS.onMouseout)
			.style("transition", "all .2s ease-in-out")
			.merge(rects)
			.attr("x", function(d, i) { return STATE.xScale(i); })
			.attr("y", function(d) { return STATE.yScale(d[0]); })
			.attr("height", function(d) { return height - STATE.yScale(d[0]); })
			.attr("width", STATE.xScale.bandwidth())
			.attr("fill", PROPS.fill);
	}
	render() {
		const STATE = this.state,
			PROPS = this.props;
		return (
			<svg height={ PROPS.height } width={ PROPS.width } style={ { display: "block" } } id={ PROPS.id }>
				<g className="graph-area"/>
				<g className="x axis"/>
				<g className="y axis"/>
			</svg>
		)
	}

}
BarGraph.defaultProps = {
	id: newGraphId(),

	margin: DEFAULT_MARGIN,
	width: "100%",
	height: 300,

	xScaleType: "ordinal",
	xAxis: true,
	xPadding: [0.25, 0.25],

	yAxis: true,

	data: [],

	fill: "#000",

	onMouseover: null,
	onMouseout: null
}