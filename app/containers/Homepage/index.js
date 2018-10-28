/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, {Component} from "react"
import L from "leaflet"
import "./index.css"

const TOKEN = "pk.eyJ1Ijoia2VubmV0aG5naGsiLCJhIjoiY2pucXZsbjRvMDF1NTNwbW5mdXBlcXQwYiJ9.i_mwJiu1BU029CAcVEm7rw"

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends Component {
	componentDidMount() {
		// create map
		this.map = L.map("map", {
			center: [34.667330, 135.500235],
			zoom: 13,
			layers: [
				L.tileLayer("https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token="+TOKEN, {
					attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
				}),
			]
		})
	}

	render() {
		return <div id="map"></div>
	}
}
