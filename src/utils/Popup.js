import * as d3 from "d3"

export default function Popup() {
	let parent = null,
		parentNode = null,
		popupDiv = null,
		popupDivNode = null,
		popupTable = null,
		popupTableNode = null,
		data = [],
		position = [0, 0];

	function popup(selection) {
		if (arguments.length) {
			parent = selection
				.style("position", "relative");
			parentNode = parent.node();
			popupTable = parent.append("table")
				.attr("class", "popup hide");
			popupTableNode = popupTable.node();
			return popup;
		}

		let rows = popupTable.selectAll(".popup-row").data(data);
		rows.exit().remove();
		rows.enter().append("tr")
			.attr("class", function(d, i) {
				if (i == 0 && d.length == 1) {
					return "popup-row popup-header";
				}
				return "popup-row";
			});

		let columns = rows.selectAll(".popup-column").data(d => d);
		columns.exit().remove();
		columns.enter().append("td")
			.attr("class", "popup-column")
			.merge(columns).text(d => d);

		popupTable.select(".popup-header")
			.selectAll("td").attr("colspan", 2);

		let rect = popupTableNode.getBoundingClientRect(),
			width = rect.right - rect.left,
			height = rect.bottom - rect.top;

		popupTable
			.style("left", (-width + position[0] - 5) + "px")
			.style("top", (-height + position[1] - 5) + "px");
		return popup;
	}
	popup.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return popup;
	}
	popup.hide = function() {
		popupTable.classed("hide", true)
			.classed("show", false);
		return popup;
	}
	popup.show = function() {
		popupTable.classed("hide", false)
			.classed("show", true);
		return popup();
	}
	popup.move = function(pos) {
		position = pos;
		return popup();
	}
	return popup;
}