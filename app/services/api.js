import { formatLagLng } from "../utils/location"

export const PROFILE_CAR = "car"
export const PROFILE_BICYCLE = "bicycle"

const buildApiUrl = (locations, profile = PROFILE_CAR) => {
    const startLatLng = formatLagLng(locations[0].latLng)
    const endLatLng = formatLagLng(locations[1].latLng)

    return "http://127.0.0.1:5000/route/v1/"+profile+"/"+startLatLng+";"+endLatLng+"?steps=true"
}

export const fetchRoute = (locations, profile = PROFILE_CAR) => {
    return fetch(buildApiUrl(locations, profile))
        .then(function(res) {
            return res.json()
        })
}