import React from "react"

import { range } from "d3"

function getPlaceName(place, placesMap) {
    if (!place || ! placesMap) return "";
    return placesMap.get(place) && placesMap.get(place).name;
}

const SheetLink = ({ sheet, active, onSheetClick }) => {
    return (
        <a className={ "cfs-nav-link " + (active ? "active" : "interactive") }
            onClick={ () => onSheetClick(sheet) }>
            { sheet }
        </a>
    )
}

export default function({ selectedPlace, selectedSheet, placesMap, isLoading, onSheetClick }) {
	return (
		<nav className="cfs-navbar text-white">
			<div className="navbar-brand">Community Fact Sheets</div>
            <div className="navbar-brand loading-indicator">
                { isLoading ?
                    <span className="fa fa-lg fa-cog fa-spin"/>
                    : null
                }
            </div>
            { selectedPlace ?
                <div className="navbar-brand selected-place">
                    { getPlaceName(selectedPlace, placesMap) }
                </div>
                : null
            }
			<nav className="cfs-navbar-nav pull-right">
                {
                    range(1, 8).map(function(num) {
                        let sheet = "Sheet "+num;
                        return <SheetLink key={ sheet } sheet={ sheet }
                                    active={ selectedSheet == sheet }
                                    onSheetClick={ onSheetClick }/>;
                    })
                }
			</nav>
		</nav>
	)
}