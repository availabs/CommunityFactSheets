import { SELECT_PLACE, RESET_PLACE, DEFAULT_PLACE_ID } from "../actions";

export default function selectedPlace(state = DEFAULT_PLACE_ID, action) {
	switch (action.type) {
		case SELECT_PLACE:
			return action.selectedPlace;
		case RESET_PLACE:
			return DEFAULT_PLACE_ID;
		default:
			return state;
	}
}