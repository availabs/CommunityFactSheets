import { connect } from 'react-redux'
import { selectPlace, resetPlace, retrieveCensusData } from '../../actions'

import SideBar from '../../components/layout/SideBar.react'

const mapStateToProps = state => {
    return {
        places: state.placesHierarchy,
        placesMap: state.placesMap,
        selectedPlace: state.selectedPlace
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onPlaceClick: id => { dispatch(selectPlace(id)); dispatch(retrieveCensusData(id)); },
        onResetClick: () => dispatch(resetPlace())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)