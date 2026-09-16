// firebase-config.js

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/*
 * Replace these values with the Firebase Web App
 * configuration from your Firebase Console.
 */

const firebaseConfig = {

    apiKey: "AIzaSyB0YnRetPhctB8Ucm5CUKb0sMQLJKlOJhM",

    authDomain:
        "smartcommute-9ce89.firebaseapp.com",

    projectId:
        "smartcommute-9ce89",

    storageBucket:
        "smartcommute-9ce89.firebasestorage.app",

    messagingSenderId:
        "659870699683",

    appId:
        "1:659870699683:web:665c1633939e11d300af16"

};


/* Initialize Firebase */

const firebaseApp =
    initializeApp(firebaseConfig);


/* Firebase Authentication */

const auth =
    getAuth(firebaseApp);


/* Cloud Firestore */

const db =
    getFirestore(firebaseApp);


export {
    firebaseApp,
    auth,
    db
};
