import { formatLagLng } from "../utils/location"
import { get } from "lodash"
import { profiles } from "../configs"

const buildApiUrl = (locations, profile = PROFILE_CAR) => {
    const startLatLng = formatLagLng(locations[0].latLng)
    const endLatLng = formatLagLng(locations[1].latLng)

    return "http://127.0.0.1:"+get(profiles, [profile, "apiPort"], 5000)+"/route/v1/"+profile+"/"+startLatLng+";"+endLatLng+"?steps=true"
}

export const fetchRoute = (locations, profile = PROFILE_CAR) => {
    return fetch(buildApiUrl(locations, profile))
        .then(function(res) {
            return res.json()
        })
}