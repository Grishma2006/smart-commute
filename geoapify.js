/* =========================================================
   SMART COMMUTE - GEOAPIFY INTEGRATION
========================================================= */

/*
   Replace this with your NEW Geoapify browser API key.

   Do not use the old key if you previously exposed it publicly.
*/

const GEOAPIFY_API_KEY = "89398d24d2e345349d6755ab088d4f3d";


/* =========================================================
   ADDRESS AUTOCOMPLETE
========================================================= */

async function searchGeoapifyPlaces(text) {

    if (!text || text.trim().length < 2) {
        return [];
    }

    if (
        !GEOAPIFY_API_KEY ||
        GEOAPIFY_API_KEY === "YOUR_NEW_GEOAPIFY_API_KEY"
    ) {
        throw new Error("Geoapify API key is not configured.");
    }

    const params = new URLSearchParams({
        text: text.trim(),
        format: "json",
        limit: "5",
        filter: "countrycode:in",
        apiKey: GEOAPIFY_API_KEY
    });

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params}`
    );

    if (!response.ok) {
        throw new Error(
            `Geoapify geocoding failed: ${response.status}`
        );
    }

    const data = await response.json();

    return (data.results || []).map((place) => ({
        name:
            place.formatted ||
            place.address_line1 ||
            "Unknown location",

        address:
            place.formatted ||
            place.address_line1 ||
            "",

        lat: Number(place.lat),
        lng: Number(place.lon),

        city:
            place.city ||
            place.county ||
            "",

        state:
            place.state ||
            "",

        country:
            place.country ||
            "India"
    }));
}


/* =========================================================
   ROUTING
========================================================= */

async function getGeoapifyRoute(locations) {

    if (!Array.isArray(locations) || locations.length < 2) {
        throw new Error("At least two locations are required.");
    }

    if (
        !GEOAPIFY_API_KEY ||
        GEOAPIFY_API_KEY === "YOUR_NEW_GEOAPIFY_API_KEY"
    ) {
        throw new Error("Geoapify API key is not configured.");
    }

    const waypoints = locations
        .map((location) => {
            return `${Number(location.lat)},${Number(location.lng)}`;
        })
        .join("|");

    const params = new URLSearchParams({
        waypoints: waypoints,
        mode: "drive",
        format: "geojson",
        intermediate_waypoint_mode: "stopover",
        apiKey: GEOAPIFY_API_KEY
    });

    const response = await fetch(
        `https://api.geoapify.com/v1/routing?${params}`
    );

    if (!response.ok) {
        throw new Error(
            `Geoapify routing failed: ${response.status}`
        );
    }

    const geojson = await response.json();

    let distanceMeters = 0;
    let timeSeconds = 0;

    if (
        geojson &&
        geojson.properties &&
        Array.isArray(geojson.properties.legs)
    ) {

        for (const leg of geojson.properties.legs) {

            if (typeof leg.distance === "number") {
                distanceMeters += leg.distance;
            }

            if (typeof leg.time === "number") {
                timeSeconds += leg.time;
            }
        }
    }

    /*
       Some Geoapify responses provide summary information.
       Use it when available.
    */

    if (
        geojson.properties &&
        geojson.properties.distance !== undefined
    ) {
        distanceMeters =
            Number(geojson.properties.distance) ||
            distanceMeters;
    }

    if (
        geojson.properties &&
        geojson.properties.time !== undefined
    ) {
        timeSeconds =
            Number(geojson.properties.time) ||
            timeSeconds;
    }

    return {
        geojson: geojson,
        distance: distanceMeters,
        time: timeSeconds
    };
}


/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatDistance(km) {

    const value = Number(km) || 0;

    if (value < 1) {
        return `${Math.round(value * 1000)} m`;
    }

    return `${value.toFixed(1)} km`;
}


function formatDuration(minutes) {

    const total = Math.max(
        0,
        Math.round(Number(minutes) || 0)
    );

    const hours = Math.floor(total / 60);
    const mins = total % 60;

    if (hours > 0) {
        return `${hours} hr ${mins} min`;
    }

    return `${mins} min`;
}


/* =========================================================
   EXPORT
========================================================= */

window.GEOAPIFY_API_KEY = GEOAPIFY_API_KEY;
window.searchGeoapifyPlaces = searchGeoapifyPlaces;
window.getGeoapifyRoute = getGeoapifyRoute;
window.formatDistance = formatDistance;
window.formatDuration = formatDuration;
