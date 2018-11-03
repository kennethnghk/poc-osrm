import React, { Component } from "react"
import L from "leaflet"
import styled from "styled-components"
import { get, concat } from "lodash"
import { MAPBOX_TOKEN, profiles } from "../../configs"
import { fetchRoute } from "../../services/api"
import routeParser from "../../utils/routeParser"
import { reverseLaglng } from "../../utils/location" 

const Container = styled.div`
	width:100%;
	display: flex;
	flex-direction: row;
`

const Map = styled.div`
	width: 80%;
	height: 800px;
`

const Panel = styled.div`
	width: 20%;
	height: 800px;
	padding: 10px;
`

const Location = styled.div`
	background: #f1f1f1;
`

const RouteTitle = styled.div`
	margin: 20px 0 0 0;
`

const RouteContainer = styled.div`
	width:100%;
`

const Route = styled.div`
	border: 1px solid #c4c4c4;
	width: 100%
	padding: 0 0 0 10px;
	background: ${props => props.isSelected ? "#c4c4c4" : "#fff"};
	margin: 5px 0 0 0;
`

const GetRouteBtn = styled.div`
	padding: 5px;
	marigin: 5px 0 0 0;
	background: #595959;
	color: #fff;
`

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends Component {
	map
	routeLine
	startLocation
	endLocation
	startMarker
	endMarker

	constructor(props) {
		super(props)

		this.state = {
			selectedRoute : null,
			routes: []
		}
	}

	showRoutes = () => {

		if (!this.startLocation || !this.endLocation) {
			return
		}

		// clear prev query
		this.setState({
			routes: [],
			selectedRoute : null
		})

		if (this.map) {
			this.startMarker && this.map.removeLayer(this.startMarker)
			this.endMarker && this.map.removeLayer(this.endMarker)
			this.routeLine && this.map.removeLayer(this.routeLine)
		}

		const startLagLng = this.startLocation.split(",")
		const endLagLng = this.endLocation.split(",")

		// add markers
		this.startMarker = L.marker(startLagLng, {title: "START"}).addTo(this.map)
		this.endMarker = L.marker(endLagLng, {title: "END"}).addTo(this.map)

		Object.keys(profiles).forEach(profile => {
			this.getRoutesFromApi(startLagLng, endLagLng, profile).then(routes => {
				routes = routes.map(route => {
					route.profile = profile
					return route
				})

				this.setState({
					routes : concat(this.state.routes, routes)
				})
			})
		})
	}

	getRoutesFromApi = (startLagLng, endLagLng, profile) => {
		return fetchRoute(startLagLng, endLagLng, profile).then(data => {
			if (data.code === "Ok") {
				return routeParser.getRoutes(data)
			}
			return []
		})

	}

	plotRoute = (routeIndex) => {
		if (routeIndex === null || this.state.selectedRoute === routeIndex) {
			return
		}

		if (this.map && this.routeLine) {
			this.map.removeLayer(this.routeLine)
		}

		this.setState({selectedRoute: routeIndex})

		const route = get(this.state, ["routes", routeIndex])
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

				this.routeLine = L.polyline(waypoints, {color: "red"}).addTo(this.map)
			}
		}
	}

	componentDidMount() {
		// create map
		this.map = L.map("map", {
			center: [34.667330, 135.500235],
			zoom: 13,
			layers: [
				L.tileLayer("https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token="+MAPBOX_TOKEN, {
					attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
				}),
			]
		})
	}

	renderPanel = () => {
		const { selectedRoute, routes } = this.state

		return (
			<Panel>
				<h1>OSRM POC</h1>
				<Location>Start: <input type="text" placeholder="34.687607,135.525966" onChange={(e) => {this.startLocation = e.target.value}}></input></Location>
				<Location>End: <input type="text" placeholder="34.687607,135.525966" onChange={(e) => {this.endLocation = e.target.value}}></input></Location>
				<GetRouteBtn onClick={this.showRoutes}>Get route</GetRouteBtn>
				<hr />
				<RouteTitle>Routes: </RouteTitle>
				<RouteContainer>
					{routes.map((route, index) => 
						<Route key={index} isSelected={(selectedRoute === index)} onClick={() => this.plotRoute(index)}>
							<div>By {route.profile}</div>
							<div>Distance {route.distance} m</div>
							<div>Duration {parseInt(route.duration / 60)} min</div>
						</Route>
					)}
				</RouteContainer>
			</Panel>
		)
	}

	render() {
		return (
			<Container>
				{this.renderPanel()}
				<Map id="map"></Map>
			</Container>
		)
	}
}
