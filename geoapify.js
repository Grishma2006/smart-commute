/* =========================================================
   SMART COMMUTE - GEOAPIFY
   Address search + real road routing
   ========================================================= */

const GEOAPIFY_API_KEY = "YOUR_NEW_GEOAPIFY_API_KEY";


/* =========================================================
   ADDRESS AUTOCOMPLETE
   ========================================================= */

async function geoapifyAutocomplete(text) {

    if (!text || text.trim().length < 3) {
        return [];
    }

    const url =
        "https://api.geoapify.com/v1/geocode/autocomplete?" +
        "text=" + encodeURIComponent(text) +
        "&format=json" +
        "&limit=5" +
        "&filter=countrycode:in" +
        "&apiKey=" + GEOAPIFY_API_KEY;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Geoapify autocomplete failed");
        }

        const data = await response.json();

        return data.results || [];

    } catch (error) {

        console.error(
            "Geoapify autocomplete error:",
            error
        );

        return [];
    }
}


/* =========================================================
   AUTOCOMPLETE UI
   ========================================================= */

function setupGeoapifyAutocomplete(inputId) {

    const input =
        document.getElementById(inputId);

    if (!input) return;

    const wrapper =
        input.parentElement;

    wrapper.style.position = "relative";

    const box =
        document.createElement("div");

    box.className =
        "geoapify-suggestions";

    box.style.position = "absolute";
    box.style.left = "0";
    box.style.right = "0";
    box.style.top = "100%";
    box.style.background = "#ffffff";
    box.style.border = "1px solid #ddd";
    box.style.borderRadius = "12px";
    box.style.marginTop = "5px";
    box.style.zIndex = "9999";
    box.style.boxShadow =
        "0 12px 30px rgba(0,0,0,.12)";
    box.style.display = "none";
    box.style.overflow = "hidden";

    wrapper.appendChild(box);

    let timer = null;

    input.addEventListener(
        "input",
        function () {

            clearTimeout(timer);

            const value =
                input.value.trim();

            if (value.length < 3) {

                box.innerHTML = "";
                box.style.display = "none";

                return;
            }

            timer = setTimeout(
                async function () {

                    const results =
                        await geoapifyAutocomplete(value);

                    box.innerHTML = "";

                    if (!results.length) {
                        box.style.display = "none";
                        return;
                    }

                    results.forEach(
                        function (place) {

                            const item =
                                document.createElement("div");

                            item.style.padding =
                                "13px 15px";

                            item.style.cursor =
                                "pointer";

                            item.style.borderBottom =
                                "1px solid #eee";

                            item.style.fontSize =
                                "14px";

                            item.textContent =
                                place.formatted ||
                                place.address_line1 ||
                                "Location";

                            item.addEventListener(
                                "mouseenter",
                                function () {
                                    item.style.background =
                                        "#f5f7fb";
                                }
                            );

                            item.addEventListener(
                                "mouseleave",
                                function () {
                                    item.style.background =
                                        "#fff";
                                }
                            );

                            item.addEventListener(
                                "click",
                                function () {

                                    input.value =
                                        place.formatted ||
                                        place.address_line1 ||
                                        "";

                                    input.dataset.lat =
                                        place.lat;

                                    input.dataset.lng =
                                        place.lon;

                                    input.dataset.formatted =
                                        place.formatted || "";

                                    input.dataset.city =
                                        place.city || "";

                                    box.innerHTML = "";

                                    box.style.display =
                                        "none";

                                    input.dispatchEvent(
                                        new Event(
                                            "change",
                                            {
                                                bubbles: true
                                            }
                                        )
                                    );
                                }
                            );

                            box.appendChild(item);
                        }
                    );

                    box.style.display = "block";

                },
                350
            );
        }
    );

    document.addEventListener(
        "click",
        function (event) {

            if (
                !wrapper.contains(event.target)
            ) {
                box.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   ROUTING
   ========================================================= */

async function getGeoapifyRoute(
    points
) {

    if (
        !points ||
        points.length < 2
    ) {
        throw new Error(
            "At least two route points are required."
        );
    }

    const waypoints =
        points
            .map(
                function (point) {
                    return (
                        point.lat +
                        "," +
                        point.lng
                    );
                }
            )
            .join("|");

    const url =
        "https://api.geoapify.com/v1/routing?" +
        "waypoints=" +
        encodeURIComponent(waypoints) +
        "&mode=drive" +
        "&format=geojson" +
        "&intermediate_waypoint_mode=stopover" +
        "&apiKey=" +
        GEOAPIFY_API_KEY;

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to calculate road route."
        );
    }

    const data =
        await response.json();

    if (
        !data.features ||
        !data.features.length
    ) {
        throw new Error(
            "No route found."
        );
    }

    const feature =
        data.features[0];

    const properties =
        feature.properties || {};

    return {

        geojson: feature,

        distance:
            properties.distance || 0,

        time:
            properties.time || 0,

        distanceKm:
            (properties.distance || 0) / 1000,

        timeMinutes:
            (properties.time || 0) / 60
    };
}


/* =========================================================
   SAVE SELECTED LOCATION
   ========================================================= */

function getSelectedGeoLocation(
    inputId
) {

    const input =
        document.getElementById(inputId);

    if (!input) return null;

    const lat =
        parseFloat(input.dataset.lat);

    const lng =
        parseFloat(input.dataset.lng);

    if (
        Number.isNaN(lat) ||
        Number.isNaN(lng)
    ) {
        return null;
    }

    return {

        lat: lat,
        lng: lng,

        name:
            input.value.trim(),

        formatted:
            input.dataset.formatted ||
            input.value.trim()
    };
}


/* =========================================================
   INITIALIZE AUTOCOMPLETE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupGeoapifyAutocomplete(
            "pickup"
        );

        setupGeoapifyAutocomplete(
            "destination"
        );

        setupGeoapifyAutocomplete(
            "offerPickup"
        );

        setupGeoapifyAutocomplete(
            "offerDestination"
        );

    }
);


/* =========================================================
   EXPORT
   ========================================================= */

window.geoapifyAutocomplete =
    geoapifyAutocomplete;

window.getGeoapifyRoute =
    getGeoapifyRoute;

window.getSelectedGeoLocation =
    getSelectedGeoLocation;
