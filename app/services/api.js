import { formatLagLng } from "../utils/location"

const buildApiUrl = (locations) => {
    const startLatLng = formatLagLng(locations[0].latLng)
    const endLatLng = formatLagLng(locations[1].latLng)

    return "http://127.0.0.1:5000/route/v1/driving/"+startLatLng+";"+endLatLng+"?steps=true"
}

export const fetchRoute = (locations) => {
    return fetch(buildApiUrl(locations))
        .then(function(res) {
            return res.json()
        })
}