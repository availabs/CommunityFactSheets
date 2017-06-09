import { RECEIVE_CENSUS_DATA } from "../actions"

export default function defaultCensusData(state = [], action) {
	if (action.type === RECEIVE_CENSUS_DATA && state.length === 0) {
		return action.data;
	}
	return state;
}