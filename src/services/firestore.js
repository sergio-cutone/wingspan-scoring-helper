import firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "<apiKey />",
  authDomain: "<authDomain />",
  projectId: "<projectId />",
  storageBucket: "<storageBucket />",
  messagingSenderId: "<messagingSenderId/>",
  appId: "<appId/>",
}

firebase.initializeApp(firebaseConfig)

export default firebase
