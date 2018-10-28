import { get } from "lodash"

// data > routes > legs > steps

const getRoutes = data => get(data, "routes", [])
const getLegs = route => get(route, "legs", [])
const getSteps = leg => get(leg, "steps", [])
const getIntersections = step => get(step, "intersections", [])

export default {
    getRoutes,
    getLegs,
    getSteps,
    getIntersections
}