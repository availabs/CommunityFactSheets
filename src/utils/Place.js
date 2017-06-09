const DISTRICT = "DISTRICT"
const COUNTY = "COUNTY";
const COUNTY_SUBDIVISION = "COUNTY_SUBDIVISION";
const PLACE = "PLACE";

export const PLACE_TYPES = { DISTRICT, COUNTY, COUNTY_SUBDIVISION, PLACE };

function packIdData(state, county, cosub, place) {
	let data = [county, state];
	if (cosub) {
		data = [cosub, ...data];
	}
	if (place) {
		data = [place, ...data];
	}
	return data;
}
function makeId(data) {
	if (data.length == 1) {
		return data;
	}
	return data.pop() + "-" + makeId(data);
}
function getName(name, type) {
	let split = name.split(", ");
	if (type === COUNTY) return split[1];
	return split[0];
}

export class Place {
	constructor(data, type) {
		let idData = packIdData(data[1], data[2],
						(type === COUNTY_SUBDIVISION) || (type === PLACE) ? data[3] : undefined,
						type === PLACE ? data[4] : undefined);
		this.id = makeId(idData);
		this.type = type;
		this.name = getName(data[0], type);
		this.places = [];
	}
	district() {
		if (this.type === DISTRICT) {
			let split = this.id.split("-");
			return split[1];
		}
		return null;
	}
	county() {
		if (this.type !== DISTRICT) {
			let split = this.id.split("-");
			return split[1];
		}
		return null;
	}
	cosub() {
		if (this.type === COUNTY_SUBDIVISION) {
			let split = this.id.split("-");
			return split[2];
		}
		return null;
	}
	place() {
		if (this.type === PLACE) {
			let split = this.id.split("-");
			return split[3];
		}
		return null;
	}
}