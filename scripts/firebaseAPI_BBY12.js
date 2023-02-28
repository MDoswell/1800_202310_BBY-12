//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyChNk8KYH_mYdonhnu3m9kjTACcjwVPvFU",
    authDomain: "comp1800-bby12.firebaseapp.com",
    projectId: "comp1800-bby12",
    storageBucket: "comp1800-bby12.appspot.com",
    messagingSenderId: "133189907233",
    appId: "1:133189907233:web:ac3e8d9067b9649cc0c460"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();