// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAijxDAA_gcZ4IvNoKKWw1b9xJn-Fpdyg",
  authDomain: "projeto-crud-192a0.firebaseapp.com",
  databaseURL: "https://projeto-crud-192a0-default-rtdb.firebaseio.com",
  projectId: "projeto-crud-192a0",
  storageBucket: "projeto-crud-192a0.firebasestorage.app",
  messagingSenderId: "98343923637",
  appId: "1:98343923637:web:6d8c95f42afb07dcae73fc",
  measurementId: "G-9HBXB3X9SC"
};

// Initialize o app
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Firestore
const db = getFirestore(app);

//inicializa a export da autentificação

const auth = getAuth(app);

//exporta para outros arquivos
export { db, app , auth };