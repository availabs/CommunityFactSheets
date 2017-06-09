import { map, merge } from "d3"

import { PLACE_TYPES } from "./Place"

import CENSUS_KEY from "../../census_key"

function CensusDataFetcher(place, variables, onComplete, onError) {
	let censusData = [],
		completed = 0;

	variables.forEach(function(v, i) {
		fetchData(v, i);
	});

	function fetchData(v, i) {
		fetch(makeUrl(place, v))
			.then(response => response.json())
			.then(json => checkCompleted(json, i, v.length))
			.catch(onError);
	}
	function checkCompleted(json, i, num) {
		censusData.push({ data: json.pop().slice(0, num).map(d => +d), index: i });
		if (censusData.length === variables.length) {
			censusData.sort(function(a, b) { return a.index - b.index; });
			censusData = censusData.reduce(function(a, c) { return a.concat(c.data); }, []);
			onComplete(censusData);
		}
	}
}

function makeUrl(place, variables) {
	return `https://api.census.gov/data/2015/acs5?get=${ variables }&key=${ CENSUS_KEY }${ getFor(place) }`;
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

export default CensusDataFetcher;