//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyB2l7Y5LHDgAw-4xP2xggGBTn2R8NcINgg",
    authDomain: "project-4730739388541914931.firebaseapp.com",
    projectId: "project-4730739388541914931",
    storageBucket: "project-4730739388541914931.appspot.com",
    messagingSenderId: "459916249899",
    appId: "1:459916249899:web:5cf53be77da61c3f48936e"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();