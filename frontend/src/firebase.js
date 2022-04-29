import firebase from 'firebase/compat/app'
import "firebase/compat/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBuvlt3usQwJ9ahVvPeX7NW-swtG_XSDRw",
    authDomain: "todoapp-with-mongo.firebaseapp.com",
    projectId: "todoapp-with-mongo",
    storageBucket: "todoapp-with-mongo.appspot.com",
    messagingSenderId: "1029961759626",
    appId: "1:1029961759626:web:deeef4e450da331533a673"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider }