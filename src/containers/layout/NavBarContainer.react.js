import { connect } from 'react-redux'
import { selectPlace, selectSheet } from '../../actions'

import NavBar from '../../components/layout/NavBar.react'

const mapStateToProps = state => {
    return {
        selectedPlace: state.selectedPlace,
        selectedSheet: state.selectedSheet,
        placesMap: state.placesMap,
        isLoading: state.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSheetClick: sheet => dispatch(selectSheet(sheet))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);