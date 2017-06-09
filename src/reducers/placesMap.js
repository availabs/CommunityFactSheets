import { RECEIVE_PLACES, CAPITAL_DISTRICT } from "../actions"

import { map } from "d3"

function processPlacesForPlacesMap(data, state) {
	return map([...data, ...state.values()], function(d) { return d.id; });
}

export default function placesMap(state = map({ [CAPITAL_DISTRICT.id]: CAPITAL_DISTRICT }), action) {
	console.log("placesMap", state)
	if (action.type === RECEIVE_PLACES) {
		return processPlacesForPlacesMap(action.places, state);
	}
	return state;
}