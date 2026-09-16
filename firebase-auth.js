import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase-config.js";


/* =========================================================
   REGISTER USER
========================================================= */

async function registerUser(fullName, mobile, email, password) {

    fullName = fullName.trim();
    mobile = mobile.trim();
    email = email.trim().toLowerCase();

    if (!fullName || !mobile || !email || !password) {
        throw new Error("Please fill all required fields.");
    }

    if (password.length < 6) {
        throw new Error("Password must contain at least 6 characters.");
    }

    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = credential.user;

    await updateProfile(user, {
        displayName: fullName
    });

    await setDoc(
        doc(db, "users", user.uid),
        {
            uid: user.uid,
            fullName: fullName,
            mobile: mobile,
            email: email,
            createdAt: serverTimestamp(),
            profileCompleted: true,
            accountStatus: "active"
        }
    );

    return user;
}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(email, password) {

    email = email.trim().toLowerCase();

    if (!email || !password) {
        throw new Error("Please enter email and password.");
    }

    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return credential.user;
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {
    await signOut(auth);
}


/* =========================================================
   GET CURRENT FIREBASE USER
========================================================= */

function getCurrentFirebaseUser() {
    return auth.currentUser;
}


/* =========================================================
   GET FIRESTORE PROFILE
========================================================= */

async function getUserProfile(uid) {

    if (!uid) {
        return null;
    }

    const snapshot = await getDoc(
        doc(db, "users", uid)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data();
}


/* =========================================================
   PROTECT PAGE
========================================================= */

function protectPage() {

    return new Promise((resolve) => {

        const unsubscribe = onAuthStateChanged(
            auth,
            async (user) => {

                unsubscribe();

                if (!user) {
                    window.location.replace("login.html");
                    return;
                }

                resolve(user);
            }
        );

    });
}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

function watchAuthState(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );
}


/* =========================================================
   EXPORT
========================================================= */

export {
    auth,
    db,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentFirebaseUser,
    getUserProfile,
    protectPage,
    watchAuthState
};
