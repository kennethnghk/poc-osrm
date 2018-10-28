import React, {Component, Fragment} from "react"
import L from "leaflet"
import "./index.css"
import { get } from "lodash"
import { fetchRoute } from "../../services/api"
import routeParser from "../../utils/routeParser"
import { reverseLaglng, formatLagLng } from "../../utils/location" 

const TOKEN = "pk.eyJ1Ijoia2VubmV0aG5naGsiLCJhIjoiY2pucXZsbjRvMDF1NTNwbW5mdXBlcXQwYiJ9.i_mwJiu1BU029CAcVEm7rw"

const LOCATIONS = [
	{
		name: "Osaka Castle",
		latLng: [34.687607, 135.525966]
	},
	{
		name: "Kaiyukan",
		latLng: [34.654739, 135.429018]
	}
]

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends Component {
	map

	plotRoute = () => {
		LOCATIONS.forEach((location) => {
			L.marker(location.latLng, {title: location.name}).addTo(this.map)
		})

		fetchRoute(LOCATIONS).then((data) => {
			if (data.code === "Ok") {
				const route = routeParser.getRoutes(data)[0]
				if (route) {
					const leg = routeParser.getLegs(route)[0]
					if (leg) {
						const waypoints = []
						const steps = routeParser.getSteps(leg)
						steps.forEach(step => {
							const intersections = routeParser.getIntersections(step)
							intersections.forEach(intersection => {
								const location = get(intersection, "location")
								if (location) {
									waypoints.push(reverseLaglng(location))
								}
							})
						})

						waypoints.forEach(waypoint => L.marker(waypoint).addTo(this.map))
						L.polyline(waypoints, {color: "red"}).addTo(this.map)
					}
				}
            }
		})
	}

	componentDidMount() {
		// create map
		this.map = L.map("map", {
			center: [34.667330, 135.500235],
			zoom: 13,
			layers: [
				L.tileLayer("https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token="+TOKEN, {
					attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
				}),
			]
		})

		this.plotRoute()
	}

	render() {
		return (
			<Fragment>
			<div className="header">It is showing the route from {LOCATIONS[0].name} ({formatLagLng(LOCATIONS[0].latLng)}) to {LOCATIONS[1].name} ({formatLagLng(LOCATIONS[1].latLng)})</div>
		<div id="map"></div>
		</Fragment>
		)
	}
}
