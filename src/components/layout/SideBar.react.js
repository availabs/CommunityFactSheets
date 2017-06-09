import React from "react"

import { select } from "d3"

import { DEFAULT_PLACE_ID } from "../../actions"

export default class SideBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			doubleWide: false,
			tripleWide: false,
			children: [],
			grandChildren: []
		};

		this.setChildren = this.setChildren.bind(this);
		this.setGrandChildren = this.setGrandChildren.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.resetControls = this.resetControls.bind(this);
		this.openDoubleWide = this.openDoubleWide.bind(this);
		this.closeDoubleWide = this.closeDoubleWide.bind(this);
		this.openTripleWide = this.openTripleWide.bind(this);
		this.closeTripleWide = this.closeTripleWide.bind(this);
		this.selectPlace = this.selectPlace.bind(this);
		this.removeActive = this.removeActive.bind(this);
	}
	render() {
		return (
			<div id="sidebar" className="sidebar text-white">

				<div className="sidebar-div1"
					onMouseOver={ this.openDoubleWide }
					onMouseOut={ this.closeDoubleWide }>
					{

						this.props.places.map(function(place) {
							return (
								<div key={ place.id } className="sidebar-item interactive"
									onMouseOver={ this.setChildren.bind(this, place.places, ".sidebar-div1") }
									onClick={ this.selectPlace.bind(null, place.id) }>
									{ place.name }
								</div>
							)
						}, this)
					}
				</div>

				<div className="sidebar-div2"
					onMouseOver={ this.openDoubleWide }
					onMouseOut={ this.closeDoubleWide }>
					{
						this.state.children.map(function(place) {
							return (
								<div key={ place.id } className="sidebar-item interactive"
									onClick={ this.selectPlace.bind(null, place.id) }
									onMouseOver={ place.places.length ? this.setGrandChildren.bind(this, place.places, ".sidebar-div2") : this.removeActive }
									onMouseOut={ place.places.length ? this.closeTripleWide : null }>
									{ place.name }
									{ place.places.length ?
										<span className="fa fa-chevron-right pull-right"/>
										: null
									}
								</div>
							)
						}, this)
					}
				</div>

				<div className="sidebar-div3"
					onMouseOver={ this.openTripleWide }
					onMouseOut={ this.closeTripleWide }>
					{
						this.state.grandChildren.map(function(place) {
							return (
								<div key={ place.id } className="sidebar-item interactive"
									onClick={ this.selectPlace.bind(null, place.id) }>
									{ place.name }
								</div>
							)
						}, this)
					}
				</div>

				<span className={ "fa fa-2x sidebar-control sidebar-open " + (this.state.open ? "fa-chevron-left" : "fa-chevron-right") }
					onClick={ this.toggleOpen }/>
				{ this.props.selectedPlace !== DEFAULT_PLACE_ID ?
					<span className="fa fa-2x sidebar-control sidebar-reset fa-close" onClick={ this.resetControls }/>
					: null
				}
			</div>
		)
	}
	setChildren(children, parent, e) {
		select(parent)
			.selectAll(".sidebar-item")
			.classed("active", false);
		select(e.target)
			.classed("active", true);
		this.setState({ children });
	}
	setGrandChildren(grandChildren, parent, e) {
		select(parent)
			.selectAll(".sidebar-item")
			.classed("active", false);
		select(e.target)
			.classed("active", true);
		this.setState({ grandChildren });
		this.openTripleWide()
	}
	toggleOpen() {
		let open = !this.state.open;
		select("#sidebar").classed("open", open);
		this.setState({ open: open });
	}
	resetControls() {
		select("#sidebar")
			.classed("open", false)
			.selectAll(".sidebar-item")
			.classed("active", false);
		this.setState({ open: false });
		this.props.onResetClick();
	}
	openDoubleWide() {
		let dw = this.state.doubleWide + 1;
		select("#sidebar").classed("double-wide", dw);
		this.setState({ doubleWide: dw });
	}
	closeDoubleWide() {
		let dw = Math.max(0, this.state.doubleWide - 1);
		select("#sidebar").classed("double-wide", dw);
		this.setState({ doubleWide: dw });
	}
	openTripleWide() {
		let tw = this.state.tripleWide + 1;
		select("#sidebar").classed("triple-wide", tw);
		this.setState({ doubleWide: 1, tripleWide: tw });
	}
	closeTripleWide() {
		let tw = this.state.tripleWide - 1;
		select("#sidebar").classed("triple-wide", tw);
		this.setState({ tripleWide: tw });
	}
	selectPlace(id) {
		select("#sidebar")
			.classed("double-wide", false)
			.classed("open", false);
		select("#sidebar")
			.selectAll(".sidebar-item")
			.classed("active", false);
		this.setState({
			open: false,
			doubleWide: 0
		});
		this.props.onPlaceClick(id);
	}
	removeActive() {
		select("#sidebar")
			.select(".sidebar-div2")
			.selectAll(".sidebar-item")
			.classed("active", false);
	}
}