// firebase-auth.js

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


import {
    auth,
    db
} from "./firebase-config.js";


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function firebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "An account with this email already exists.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password is too weak. Use at least 6 characters.";

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/user-not-found":
            return "No account was found with this email.";

        case "auth/wrong-password":
            return "Incorrect email or password.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        default:
            return "Something went wrong. Please try again.";

    }

}


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById("mobile")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* -----------------------------------------
               Validation
               ----------------------------------------- */

            if (fullName.length < 2) {

                showFirebaseMessage(
                    message,
                    "Please enter your full name."
                );

                return;

            }


            if (!/^[0-9]{10}$/.test(mobile)) {

                showFirebaseMessage(
                    message,
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            if (password.length < 6) {

                showFirebaseMessage(
                    message,
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (password !== confirmPassword) {

                showFirebaseMessage(
                    message,
                    "Passwords do not match."
                );

                return;

            }


            try {

                showFirebaseMessage(
                    message,
                    "Creating your account...",
                    "success"
                );


                /* -------------------------------------
                   Firebase Authentication account
                   ------------------------------------- */

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /* -------------------------------------
                   Firebase Auth display name
                   ------------------------------------- */

                await updateProfile(
                    user,
                    {
                        displayName: fullName
                    }
                );


                /* -------------------------------------
                   Firestore user profile
                   ------------------------------------- */

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {

                        uid:
                            user.uid,

                        fullName:
                            fullName,

                        mobile:
                            mobile,

                        email:
                            email,

                        createdAt:
                            serverTimestamp(),

                        profileCompleted:
                            true,

                        accountStatus:
                            "active"

                    }
                );


                showFirebaseMessage(
                    message,
                    "Account created successfully. Opening dashboard...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );

            }


            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showFirebaseMessage(
                    message,
                    firebaseErrorMessage(error)
                );

            }

        }
    );

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            try {

                showFirebaseMessage(
                    message,
                    "Signing you in...",
                    "success"
                );


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                showFirebaseMessage(
                    message,
                    "Login successful. Opening dashboard...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    500
                );

            }


            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showFirebaseMessage(
                    message,
                    firebaseErrorMessage(error)
                );

            }

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton =
    document.getElementById("logoutBtn");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   PROTECTED PAGE
   ========================================================= */

function protectPage() {

    onAuthStateChanged(
        auth,
        function (user) {

            if (!user) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

function getCurrentFirebaseUser() {

    return auth.currentUser;

}


/* =========================================================
   GET FIRESTORE PROFILE
   ========================================================= */

async function getUserProfile(uid) {

    try {

        const userReference =
            doc(
                db,
                "users",
                uid
            );


        const snapshot =
            await getDoc(
                userReference
            );


        if (!snapshot.exists()) {

            return null;

        }


        return snapshot.data();

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        return null;

    }

}


/* =========================================================
   MESSAGE HELPER
   ========================================================= */

function showFirebaseMessage(
    element,
    message,
    type = "error"
) {

    if (!element) return;


    element.textContent =
        message;


    element.className =
        `form-message ${type}`;

}


/* =========================================================
   EXPORTS
   ========================================================= */

export {
    auth,
    db,
    protectPage,
    getCurrentFirebaseUser,
    getUserProfile
};
