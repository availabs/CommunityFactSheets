import { connect } from 'react-redux'

import Sheet_3 from '../../components/sheets/Sheet_3.react'

const mapStateToProps = state => {
    return {
        data: state.censusData,
        selectedPlace: state.selectedPlace
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         onPageClick: id => { dispatch(selectPlace(id)); dispatch(retrieveCensusData(id)); }
//     }
// }

export default connect(mapStateToProps)(Sheet_3);