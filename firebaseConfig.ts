// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOCamVdGBbQEkLQRGQoE1BTQalfqllTrA",
  authDomain: "react-pokemon-app-28c88.firebaseapp.com",
  projectId: "react-pokemon-app-28c88",
  storageBucket: "react-pokemon-app-28c88.firebasestorage.app",
  messagingSenderId: "614597195276",
  appId: "1:614597195276:web:3a0916549cdf0473d72029"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app