import React from "react"
import { connect } from 'react-redux'

import Layout from "./components/layout"

import Sheets from "./components/sheets"

import { SHEET_1, SHEET_2, SHEET_3, SHEET_4, SHEET_5, SHEET_6, SHEET_7 } from "./utils/CensusVariables";

const mapStateToProps = state => {
    return {
        selectedSheet: state.selectedSheet
    }
}

function App({ selectedSheet }) {
	let Sheet = Sheets[SHEET_3];
	return (
		<Layout>
			<Sheet />
		</Layout>
	)
}

export default connect(mapStateToProps)(App)