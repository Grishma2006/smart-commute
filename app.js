// ==================================================
// SMART COMMUTE - COMMON APP FUNCTIONS
// ==================================================


// --------------------------------------------------
// STORAGE KEYS
// --------------------------------------------------

const STORAGE = {

    currentJourney: "smartCommuteCurrentJourney",

    currentOfferedJourney: "smartCommuteCurrentOfferedJourney",

    offeredJourneys: "smartCommuteOfferedJourneys",

    selectedMatch: "smartCommuteSelectedMatch",

    currentRequest: "smartCommuteCurrentRequest",

    confirmedJourney: "smartCommuteConfirmedJourney",

    history: "smartCommuteHistory"

};


// --------------------------------------------------
// JSON STORAGE HELPERS
// --------------------------------------------------

function saveData(key, value) {

    sessionStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


function getData(key) {

    const value = sessionStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}


function saveLocalData(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


function getLocalData(key) {

    const value = localStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}


// --------------------------------------------------
// DELETE DATA
// --------------------------------------------------

function removeData(key) {

    sessionStorage.removeItem(key);

}


// --------------------------------------------------
// DISTANCE BETWEEN TWO LOCATIONS
// --------------------------------------------------

function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


// --------------------------------------------------
// TIME DIFFERENCE
// --------------------------------------------------

function timeDifferenceMinutes(time1, time2) {

    const first = parseTime(time1);

    const second = parseTime(time2);

    if (first === null || second === null) {
        return 999;
    }

    return Math.abs(first - second);
}


function parseTime(time) {

    if (!time) {
        return null;
    }

    const parts = time.split(":");

    if (parts.length < 2) {
        return null;
    }

    const hour = Number(parts[0]);

    const minute = Number(parts[1]);

    return hour * 60 + minute;
}


// --------------------------------------------------
// MATCH SCORE
// --------------------------------------------------

function calculateTimeScore(minutesDifference) {

    const maxDifference = 30;

    if (minutesDifference >= maxDifference) {
        return 0;
    }

    return Math.max(
        0,
        100 -
        (minutesDifference / maxDifference) * 100
    );
}


function calculateDistanceScore(distanceKm, maximumKm = 5) {

    if (distanceKm >= maximumKm) {
        return 0;
    }

    return Math.max(
        0,
        100 -
        (distanceKm / maximumKm) * 100
    );
}


// --------------------------------------------------
// COST ESTIMATION
// --------------------------------------------------

function calculateEstimatedJourneyCost(distanceKm) {

    if (!distanceKm || distanceKm <= 0) {
        return 0;
    }

    // Prototype estimation only.
    const baseRate = 10;

    const minimumCost = 30;

    return Math.max(
        minimumCost,
        Math.round(distanceKm * baseRate)
    );
}


function calculateCostShare(
    totalCost,
    participants = 2
) {

    if (!totalCost || participants <= 0) {
        return 0;
    }

    return Math.round(
        totalCost / participants
    );
}


// --------------------------------------------------
// DATE FORMAT
// --------------------------------------------------

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// --------------------------------------------------
// NOTIFICATION
// --------------------------------------------------

function showToast(message, type = "success") {

    let toast =
        document.getElementById("appToast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "appToast";

        toast.className = "app-toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.dataset.type = type;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);
}


// --------------------------------------------------
// NAVBAR MOBILE
// --------------------------------------------------

function initializeMobileMenu() {

    const button =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const nav =
        document.querySelector(
            ".nav-links"
        );

    if (!button || !nav) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            nav.classList.toggle("open");

        }
    );
}


// --------------------------------------------------
// PAGE INITIALIZATION
// --------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMobileMenu();

    }
);


// --------------------------------------------------
// EXPORT TO WINDOW
// --------------------------------------------------

window.STORAGE = STORAGE;

window.saveData = saveData;

window.getData = getData;

window.saveLocalData = saveLocalData;

window.getLocalData = getLocalData;

window.removeData = removeData;

window.calculateDistanceKm =
    calculateDistanceKm;

window.timeDifferenceMinutes =
    timeDifferenceMinutes;

window.calculateTimeScore =
    calculateTimeScore;

window.calculateDistanceScore =
    calculateDistanceScore;

window.calculateEstimatedJourneyCost =
    calculateEstimatedJourneyCost;

window.calculateCostShare =
    calculateCostShare;

window.formatDate =
    formatDate;

window.showToast =
    showToast;
