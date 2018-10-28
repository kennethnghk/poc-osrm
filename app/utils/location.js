export const reverseLaglng = (latLng) => [latLng[1], latLng[0]]

export const formatLagLng = (latLng) => reverseLaglng(latLng).join(",")