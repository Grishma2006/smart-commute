/* =========================================================
   SMART COMMUTE
   Main Website JavaScript
   Authentication is handled by firebase-auth.js
   ========================================================= */


/* ---------------------------------------------------------
   Helper: Show Message
   --------------------------------------------------------- */

function showMessage(elementId, message, type = "error") {

    const element =
        document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;

    element.className =
        `form-message ${type}`;
}


/* ---------------------------------------------------------
   Password Show / Hide
   --------------------------------------------------------- */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.target;

            const input =
                document.getElementById(targetId);

            if (!input) return;


            if (input.type === "password") {

                input.type = "text";

                button.textContent = "Hide";

            } else {

                input.type = "password";

                button.textContent = "Show";

            }

        });

    });


/* ---------------------------------------------------------
   DASHBOARD OPTIONS
   --------------------------------------------------------- */

function goToFindRide() {

    window.location.href =
        "find-ride.html";

}


function goToOfferRide() {

    window.location.href =
        "offer-ride.html";

}


/* ---------------------------------------------------------
   LOGOUT
   ---------------------------------------------------------

   Logout is now handled by Firebase.

   Do NOT use localStorage authentication here.
   firebase-auth.js handles the logout button.
   --------------------------------------------------------- */


/* ---------------------------------------------------------
   Make Dashboard Functions Available
   ---------------------------------------------------------

   Because dashboard.html uses:

       onclick="goToFindRide()"

   and:

       onclick="goToOfferRide()"

   we expose the functions globally.
   --------------------------------------------------------- */

window.goToFindRide =
    goToFindRide;

window.goToOfferRide =
    goToOfferRide;
