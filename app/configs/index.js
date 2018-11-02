export const MAPBOX_TOKEN = "pk.eyJ1Ijoia2VubmV0aG5naGsiLCJhIjoiY2pucXZsbjRvMDF1NTNwbW5mdXBlcXQwYiJ9.i_mwJiu1BU029CAcVEm7rw"

export const PROFILE_CAR = "car"
export const PROFILE_BICYCLE = "bicycle"

export const profiles = {
    [PROFILE_CAR] : {
        color: "red",
        apiPort: 5001
    },
    [PROFILE_BICYCLE]: {
        color: "green",
        apiPort: 5000
    }
}