const GEOAPIFY_API_KEY = "89398d24d2e345349d6755ab088d4f3d";

window.GEOAPIFY_API_KEY = GEOAPIFY_API_KEY;


// --------------------------------------------------
// ADDRESS SEARCH
// --------------------------------------------------

async function searchGeoapifyPlaces(text) {

    if (!text || text.trim().length < 2) {
        return [];
    }

    const url =
        `https://api.geoapify.com/v1/geocode/autocomplete` +
        `?text=${encodeURIComponent(text)}` +
        `&format=json` +
        `&limit=6` +
        `&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Geoapify search error: ${response.status}`);
    }

    const data = await response.json();

    return data.results || [];
}


// --------------------------------------------------
// ROUTING
// --------------------------------------------------

async function getGeoapifyRoute(locations) {

    if (!locations || locations.length < 2) {
        throw new Error("At least two locations are required.");
    }

    const waypoints = locations
        .map(location => `${location.lat},${location.lng}`)
        .join("|");

    const url =
        `https://api.geoapify.com/v1/routing` +
        `?waypoints=${encodeURIComponent(waypoints)}` +
        `&mode=drive` +
        `&format=geojson` +
        `&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Geoapify routing error: ${response.status}`);
    }

    const data = await response.json();

    let distance = 0;
    let time = 0;

    if (Array.isArray(data.features)) {

        data.features.forEach(feature => {

            const properties = feature.properties || {};

            distance += Number(properties.distance || 0);
            time += Number(properties.time || 0);

        });
    }

    return {
        ...data,
        distance,
        time,
        geojson: data
    };
}


// --------------------------------------------------
// FORMAT DISTANCE
// --------------------------------------------------

function formatDistance(meters) {

    if (!meters) {
        return "0 km";
    }

    const km = Number(meters) / 1000;

    if (km < 10) {
        return `${km.toFixed(1)} km`;
    }

    return `${Math.round(km)} km`;
}


// --------------------------------------------------
// FORMAT TIME
// --------------------------------------------------

function formatDuration(seconds) {

    if (!seconds) {
        return "0 min";
    }

    const minutes = Math.round(Number(seconds) / 60);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (remaining === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${remaining} min`;
}


export {
    searchGeoapifyPlaces,
    getGeoapifyRoute,
    formatDistance,
    formatDuration
};
