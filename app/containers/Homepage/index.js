import React, {Component, Fragment} from "react"
import L from "leaflet"
import styled from 'styled-components'
import { get } from "lodash"
import { MAPBOX_TOKEN, PROFILE_BICYCLE, PROFILE_CAR, profiles } from "../../configs"
import { fetchRoute } from "../../services/api"
import routeParser from "../../utils/routeParser"
import { reverseLaglng, formatLagLng } from "../../utils/location" 

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
	display: flex;
	flex-direction: row;
`

const RouteOption = styled.div`
	border: 1px solid #c4c4c4;
	width: 50%;
	padding: 0 0 0 10px;
	background: ${props => props.isSelected ? "#c4c4c4" : "#fff"};
`

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends Component {
	map
	routeLine
	startLocation
	endLocation

	constructor(props) {
		super(props)

		this.state = {
			selectedProfile : null
		}
	}

	plotRoute = (profile = PROFILE_CAR) => {

		if (this.state.selectedProfile === profile) {
			return
		}

		if (this.map && this.routeLine) {
			this.map.removeLayer(this.routeLine)
		}

		this.setState({selectedProfile: profile})

		const startLagLng = this.startLocation.split(",")
		const endLagLng = this.endLocation.split(",")

		// add markers
		L.marker(startLagLng, {title: "START"}).addTo(this.map)
		L.marker(endLagLng, {title: "END"}).addTo(this.map)

		fetchRoute(startLagLng, endLagLng, profile).then((data) => {
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

						this.routeLine = L.polyline(waypoints, {color: get(profiles, [profile, "color"])}).addTo(this.map)
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
				L.tileLayer("https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token="+MAPBOX_TOKEN, {
					attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
				}),
			]
		})
	}

	renderPanel = () => {
		const selectedProfile = this.state.selectedProfile

		return (
			<Panel>
				<h1>OSRM POC</h1>
				<Location>Start: <input type="text" placeholder="34.687607,135.525966" onChange={(e) => {this.startLocation  = e.target.value}}></input></Location>
				<Location>End: <input type="text" placeholder="34.687607,135.525966" onChange={(e) => {this.endLocation  = e.target.value}}></input></Location>
				<hr />
				<RouteTitle>Routes: </RouteTitle>
				<RouteContainer>
					<RouteOption isSelected={(selectedProfile === PROFILE_CAR)} onClick={() => this.plotRoute(PROFILE_CAR)}>Car</RouteOption>
					<RouteOption isSelected={(selectedProfile === PROFILE_BICYCLE)} onClick={() => this.plotRoute(PROFILE_BICYCLE)}>Bicycle</RouteOption>
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
