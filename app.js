/* =========================================================
   SMART COMMUTE
   Stage 1 - Authentication + Dashboard
   ========================================================= */


/* ---------------------------------------------------------
   Helper: Show message
   --------------------------------------------------------- */

function showMessage(elementId, message, type = "error") {

    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.className = `form-message ${type}`;
}


/* ---------------------------------------------------------
   Password Show / Hide
   --------------------------------------------------------- */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);

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
   REGISTER
   --------------------------------------------------------- */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const fullName =
            document.getElementById("fullName").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        /* Basic validation */

        if (fullName.length < 2) {

            showMessage(
                "registerMessage",
                "Please enter your full name."
            );

            return;
        }


        if (!/^[0-9]{10}$/.test(mobile)) {

            showMessage(
                "registerMessage",
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "registerMessage",
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "registerMessage",
                "Passwords do not match."
            );

            return;
        }


        /* Get existing users */

        const users =
            JSON.parse(localStorage.getItem("smartCommuteUsers")) || [];


        /* Check duplicate email */

        const existingUser =
            users.find(user => user.email === email);


        if (existingUser) {

            showMessage(
                "registerMessage",
                "An account with this email already exists."
            );

            return;
        }


        /* Create account */

        const newUser = {

            id: Date.now(),

            fullName: fullName,

            mobile: mobile,

            email: email,

            password: password

        };


        users.push(newUser);


        /* Automatically log in */
        showMessage(
            "registerMessage",
            "Account created successfully. Redirecting...",
            "success"
        );


        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 700);

    });

}


/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("loginPassword").value;


        const users =
            JSON.parse(localStorage.getItem("smartCommuteUsers")) || [];


        const user =
            users.find(
                account =>
                    account.email === email &&
                    account.password === password
            );


        if (!user) {

            showMessage(
                "loginMessage",
                "Incorrect email or password."
            );

            return;
        }


        /* Store current logged-in user */

       

        showMessage(
            "loginMessage",
            "Login successful. Redirecting...",
            "success"
        );


        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 500);

    });

}


/* ---------------------------------------------------------
   DASHBOARD AUTH CHECK
   --------------------------------------------------------- */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("smartCommuteCurrentUser")
    );

}


const dashboardName =
    document.getElementById("dashboardUserName");


if (dashboardName) {

    const currentUser = getCurrentUser();


    if (!currentUser) {

        window.location.href = "login.html";

    } else {

        dashboardName.textContent =
            currentUser.fullName;


        const emailElement =
            document.getElementById("dashboardEmail");

        if (emailElement) {

            emailElement.textContent =
                currentUser.email;

        }


        const avatar =
            document.getElementById("userAvatar");

        if (avatar) {

            avatar.textContent =
                currentUser.fullName
                    .charAt(0)
                    .toUpperCase();

        }

    }

}


/* ---------------------------------------------------------
   DASHBOARD OPTIONS
   --------------------------------------------------------- */

function goToFindRide() {

    /*
       This page will be created in the next stage.
    */

    window.location.href = "find-ride.html";

}


function goToOfferRide() {

    /*
       Vehicle information will be collected ONLY here.
    */

    window.location.href = "offer-ride.html";

}


/* ---------------------------------------------------------
   LOGOUT
   --------------------------------------------------------- */

const logoutButton =
    document.getElementById("logoutBtn");


if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem(
            "smartCommuteCurrentUser"
        );

        window.location.href = "index.html";

    });

}
