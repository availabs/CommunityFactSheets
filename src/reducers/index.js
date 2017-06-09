import { combineReducers } from 'redux'

import selectedPlace from "./selectedPlace"
import selectedSheet from "./selectedSheet"
import censusData from "./censusData"
import defaultCensusData from "./defaultCensusData"
import placesMap from "./placesMap"
import placesHierarchy from "./placesHierarchy"
import isLoading from "./isLoading"
import error from "./error"

export default combineReducers({
	selectedPlace,
	selectedSheet,
	censusData,
	defaultCensusData,
	placesMap,
	placesHierarchy,
	isLoading,
	error
})