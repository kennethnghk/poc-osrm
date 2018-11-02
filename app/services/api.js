import { formatLagLng } from "../utils/location"
import { get } from "lodash"
import { profiles } from "../configs"

const buildApiUrl = (startLatLng, endLatLng, profile = PROFILE_CAR) => "http://127.0.0.1:"+get(profiles, [profile, "apiPort"], 5000)+"/route/v1/"+profile+"/"+formatLagLng(startLatLng)+";"+formatLagLng(endLatLng)+"?steps=true"

export const fetchRoute = (startLatLng, endLatLng, profile = PROFILE_CAR) => {
    return fetch(buildApiUrl(startLatLng, endLatLng, profile))
        .then(function(res) {
            return res.json()
        })
}