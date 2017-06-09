import { SELECT_SHEET } from "../actions";

import { SHEET_3 } from "../utils/CensusVariables";

export default function selectedPlace(state = SHEET_3, action) {
	if (action.type == SELECT_SHEET) {
		return action.sheet;
	}
	return state;
}