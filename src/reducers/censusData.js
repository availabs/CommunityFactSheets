import { RECEIVE_CENSUS_DATA, RESET_PLACE } from "../actions"

export default function censusData(state = [], action) {
	if (action.type === RECEIVE_CENSUS_DATA) {
		return action.data;
	}
	return state;
}