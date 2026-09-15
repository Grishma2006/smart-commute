/* =========================================================
   SMART COMMUTE
   Stage 1 JavaScript
   ========================================================= */


/* ================= HELPER FUNCTIONS ================= */

function getStoredUser() {
    const user = localStorage.getItem("smartCommuteUser");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("Unable to read stored user:", error);
        return null;
    }
}


function saveUser(user) {
    localStorage.setItem(
        "smartCommuteUser",
        JSON.stringify(user)
    );
}


function showMessage(element, message, type = "") {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}


/* ================= REGISTER PAGE ================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    const roleInputs = document.querySelectorAll(
        'input[name="userRole"]'
    );

    const vehicleFields =
        document.getElementById("vehicleFields");


    function updateVehicleFields() {

        const selectedRole =
            document.querySelector(
                'input[name="userRole"]:checked'
            );

        if (!selectedRole) {
            return;
        }

        const needsVehicle =
            selectedRole.value === "provider" ||
            selectedRole.value === "both";

        if (vehicleFields) {
            vehicleFields.classList.toggle(
                "hidden",
                !needsVehicle
            );
        }
    }


    roleInputs.forEach((input) => {

        input.addEventListener(
            "change",
            updateVehicleFields
        );

    });


    updateVehicleFields();


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document.getElementById("fullName").value.trim();

            const mobileNumber =
                document.getElementById("mobileNumber").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const role =
                document.querySelector(
                    'input[name="userRole"]:checked'
                ).value;

            const acceptTerms =
                document.getElementById("acceptTerms").checked;


            const message =
                document.getElementById("registerMessage");


            if (fullName.length < 2) {

                showMessage(
                    message,
                    "Please enter your full name.",
                    "error"
                );

                return;
            }


            if (!/^[0-9]{10}$/.test(mobileNumber)) {

                showMessage(
                    message,
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (!acceptTerms) {

                showMessage(
                    message,
                    "Please accept the terms to continue.",
                    "error"
                );

                return;
            }


            const existingUsers =
                JSON.parse(
                    localStorage.getItem("smartCommuteUsers") || "[]"
                );


            const emailExists =
                existingUsers.some(
                    (user) =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (emailExists) {

                showMessage(
                    message,
                    "An account with this email already exists.",
                    "error"
                );

                return;
            }


            const user = {

                id:
                    "user_" +
                    Date.now(),

                name: fullName,

                mobile: mobileNumber,

                email: email,

                password: password,

                role: role,

                verified: false,

                vehicle:
                    role === "provider" ||
                    role === "both"
                        ? {
                            type:
                                document.getElementById(
                                    "vehicleType"
                                ).value,

                            model:
                                document.getElementById(
                                    "vehicleModel"
                                ).value.trim(),

                            number:
                                document.getElementById(
                                    "vehicleNumber"
                                ).value.trim(),

                            seats:
                                document.getElementById(
                                    "availableSeats"
                                ).value
                        }
                        : null

            };


            existingUsers.push(user);


            localStorage.setItem(
                "smartCommuteUsers",
                JSON.stringify(existingUsers)
            );


            saveUser(user);


            showMessage(
                message,
                "Account created successfully. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 900);

        }
    );
}


/* ================= LOGIN PAGE ================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users =
                JSON.parse(
                    localStorage.getItem(
                        "smartCommuteUsers"
                    ) || "[]"
                );


            const user =
                users.find(
                    (item) =>
                        item.email.toLowerCase() ===
                            email.toLowerCase() &&
                        item.password === password
                );


            if (!user) {

                showMessage(
                    message,
                    "Invalid email or password.",
                    "error"
                );

                return;
            }


            saveUser(user);


            showMessage(
                message,
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 600);

        }
    );


    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Password recovery will be connected through Firebase Authentication in the next stage."
                );

            }
        );

    }

}


/* ================= DASHBOARD ================= */

const dashboardName =
    document.getElementById(
        "dashboardName"
    );


if (dashboardName) {

    const user =
        getStoredUser();


    if (!user) {

        window.location.href =
            "login.html";

    } else {

        dashboardName.textContent =
            user.name.split(" ")[0];

        const welcomeUser =
            document.getElementById(
                "welcomeUser"
            );

        if (welcomeUser) {

            welcomeUser.textContent =
                "Hi, " +
                user.name.split(" ")[0];

        }

        const profileStatus =
            document.getElementById(
                "profileStatus"
            );

        if (profileStatus) {
            profileStatus.textContent =
                "Ready";
        }

    }


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "smartCommuteUser"
                );

                window.location.href =
                    "index.html";

            }
        );

    }


    const findRideButton =
        document.getElementById(
            "findRideButton"
        );


    if (findRideButton) {

        findRideButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Find a Ride will be connected in the next stage."
                );

            }
        );

    }


    const offerRideButton =
        document.getElementById(
            "offerRideButton"
        );


    if (offerRideButton) {

        offerRideButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Offer a Ride will be connected in the next stage."
                );

            }
        );

    }

}
