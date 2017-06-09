import { map } from "d3"

import { RECEIVE_PLACES } from "../actions"

import { PLACE_TYPES } from "../utils/Place"

function processPlacesForPlacesHierarchy(data) {
	let hierarchy = [];
	data.forEach(function(d, i) {
		if (d.type === PLACE_TYPES.COUNTY) {
			hierarchy.push(d);
		}
		else if (d.type === PLACE_TYPES.COUNTY_SUBDIVISION) {
			let countyId = d.id.slice(0, 6);
			let county = hierarchy.reduce(function(a, c) { return c.id == countyId ? c : a; });
			county.places.push(d);
		}
		else if (d.type === PLACE_TYPES.PLACE) {
			let countyId = d.id.slice(0, 6);
			let county = hierarchy.reduce(function(a, c) { return c.id == countyId ? c : a; });
			let cosubId = d.id.slice(0, 12);
			let cosub = county.places.reduce(function(a, c) { return c.id == cosubId ? c : a; });
			cosub.places.push(d);
		}
	})
	return hierarchy;
}

export default function placesHierarchy(state = [], action) {
	if (action.type === RECEIVE_PLACES) {
		return processPlacesForPlacesHierarchy(action.places);
	}
	return state;
}