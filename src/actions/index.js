import { map, set } from "d3"

import { CENSUS_VARIABLES, SHEET_3 } from "../utils/CensusVariables"
import { Place, PLACE_TYPES } from "../utils/Place"
import CensusDataFetcher from "../utils/CensusDataFetcher"

export const SELECT_PLACE = "SELECT_PLACE"
export const RESET_PLACE = "RESET_PLACE"

export const SELECT_SHEET = "SELECT_SHEET"

export const RECEIVE_CENSUS_DATA = "RECEIVE_CENSUS_DATA"

export const RECEIVE_PLACES = "RECEIVE_PLACES"

export const XHR_START = "XHR_START"
export const XHR_SUCCESS = "XHR_SUCCESS"
export const XHR_ERROR = "XHR_ERROR"

import CENSUS_KEY from "../census_key"


export function selectPlace(key) {
	return {
		type: SELECT_PLACE,
		selectedPlace: key
	}
}
export function resetPlace() {
	return function(dispatch, getState) {
		let state = getState();
		dispatch(receiveCensusData(state.defaultCensusData));
		dispatch(_resetPlace());
	}
}
function _resetPlace() {
	return {
		type: RESET_PLACE
	}
}

export function selectSheet(sheet) {
	return {
		type: SELECT_SHEET,
		sheet
	}
}

function receiveCensusData(data) {
	return {
		type: RECEIVE_CENSUS_DATA,
		data
	}
}

function receivePlaces(places) {
	return {
		type: RECEIVE_PLACES,
		places
	}
}

function xhrStart() {
	return {
		type: XHR_START,
		isLoading: true
	}
}
function xhrSuccess() {
	return {
		type: XHR_SUCCESS,
		isLoading: false
	}
}
function xhrError(error) {
	return {
		type: XHR_ERROR,
		isLoading: false,
		error
	}
}

const CAPITAL_DISTRICT_DATA = ["Capital District, NY Metro Area; New York","6791","36","10580"];
export const CAPITAL_DISTRICT = new Place(CAPITAL_DISTRICT_DATA, PLACE_TYPES.DISTRICT);
export const DEFAULT_PLACE_ID = CAPITAL_DISTRICT.id;

const CAPITAL_DISTRICT_COUNTIES = set(['001', '083', '091', '093']);

const VILLAGES = [
	["Ravena village, New York","36","001","16694","60675"],
	["Colonie village, New York","36","001","17343","17332"],
	["Menands village, New York","36","001","17343","46536"],
	["Altamont village, New York","36","001","31104","01517"],
	["Voorheesville village, New York","36","001","50672","77684"],
	["Hoosick Falls village, New York","36","083","35463","35474"],
	["East Nassau village, New York","36","083","49517","22557"],
	["Schaghticoke village, New York","36","083","65486","65475"],
	["Castleton-on-Hudson village, New York","36","083","65541","12870"],
	["Corinth village, New York","36","091","18223","18212"],
	["Galway village, New York","36","091","28112","28101"],
	["Round Lake village, New York","36","091","44743","63957"],
	["South Glens Falls village, New York","36","091","48318","69078"],
	["Victory village, New York","36","091","65244","77431"],
	["Schuylerville village, New York","36","091","65244","65750"],
	["Stillwater village, New York","36","091","71333","71322"],
	["Waterford village, New York","36","091","78531","78520"],
	["Delanson village, New York","36","093","21006","20082"],
	["Scotia village, New York","36","093","29366","65893"]
];

function processCountySubdivisions(data) {
	let places = [];
	let counties = map();
	data.slice(1).forEach(function(d) {
		if (d[3] == "00000") return;
		if (!CAPITAL_DISTRICT_COUNTIES.has(d[2])) return;

		if (!counties.has(d[2])) {
			counties.set(d[2], new Place(d, PLACE_TYPES.COUNTY));
		}
		places.push(new Place(d, PLACE_TYPES.COUNTY_SUBDIVISION));
	})
	let villages = VILLAGES.map(function(d) { return new Place(d, PLACE_TYPES.PLACE); });
	return [...counties.values(), ...places, ...villages];
}

export function retrieveCountySubdivisions() {
	return function(dispatch) {
		dispatch(xhrStart());
		return fetch(`https://api.census.gov/data/2015/acs5?get=NAME&key=${ CENSUS_KEY }&for=county%20subdivision:*&in=state:36`)
			.then(response => response.json())
			.then(json => { dispatch(receivePlaces(processCountySubdivisions(json))); dispatch(xhrSuccess()); })
			.catch(error => { dispatch(xhrError(error)); });
	}
}

// export function retrieveCensusData(id = DEFAULT_PLACE_ID) {
// 	return function(dispatch, getState) {
// 		let placesMap = getState().placesMap;
// 		let url = makeUrl(placesMap.get(id));
// 		dispatch(xhrStart());
// 		return fetch(url)
// 			.then(response => response.json())
// 			.then(json => { dispatch(receiveCensusData(json.pop())); dispatch(xhrSuccess()); })
// 			.catch(error => { dispatch(xhrError(error)); });
// 	}
// }
export function retrieveCensusData(id = DEFAULT_PLACE_ID) {
	return function(dispatch, getState) {
		let placesMap = getState().placesMap,
			place = placesMap.get(id);
		dispatch(xhrStart());
		return CensusDataFetcher(place, CENSUS_VARIABLES[SHEET_3],
			data => { dispatch(receiveCensusData(data)); dispatch(xhrSuccess()); },
			error => { dispatch(xhrError(error)); });
	}
}

function makeUrl(place) {
	return `https://api.census.gov/data/2015/acs5?get=${ CENSUS_VARIABLES[SHEET_3] }&key=${ CENSUS_KEY }${ getFor(place) }`;
}
function getFor(place) {
	switch (place.type) {
		case PLACE_TYPES.COUNTY:
			return `&for=county:${ place.county() }&in=state:36`;
		case PLACE_TYPES.COUNTY_SUBDIVISION:
			return `&for=county+subdivision:${ place.cosub() }&in=state:36+county:${ place.county() }`;
		case PLACE_TYPES.PLACE:
			return `&for=place:${ place.place() }&in=state:36`;
		default:
			return `&for=metropolitan+statistical+area/micropolitan+statistical+area:10580&in=state:36`;
	}
}