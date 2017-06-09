import { XHR_ERROR } from "../actions"

export default function error(state = null, action) {
	if (action.type === XHR_ERROR) {
		return action.error;
	}
	return state;
}