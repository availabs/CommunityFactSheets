import React from "react"
import { render } from "react-dom"
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import cfsApp from "./reducers"
import App from "./App.react.js"

import { selectSheet, retrieveCountySubdivisions, retrieveCensusData, selectPlace } from "./actions"
import { SHEET_3 } from "./utils/CensusVariables"

const logger = store => next => action => {
  	console.group(action.type)
  	console.info('dispatching', action)
  	let result = next(action)
  	console.log('next state', store.getState())
  	console.groupEnd(action.type)
  	return result
}

let store = createStore(cfsApp, applyMiddleware(thunkMiddleware, logger));

render(
  	<Provider store={ store }>
    	<App />
  	</Provider>,
  	document.getElementById('root')
)

store.dispatch(selectSheet(SHEET_3));
store.dispatch(retrieveCensusData());
store.dispatch(retrieveCountySubdivisions());