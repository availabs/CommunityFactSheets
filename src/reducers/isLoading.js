import { XHR_START, XHR_SUCCESS, XHR_ERROR } from "../actions"

export default function isLoading(state = false, action) {
	switch (action.type) {
		case XHR_START:
			return action.isLoading;
		case XHR_SUCCESS:
			return action.isLoading;
		case XHR_ERROR:
			return action.isLoading;
		default:
			return state;
	}
}