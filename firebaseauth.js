// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy4V5-rnTurffLpUFI9Y_jhfh8a9vOkDg",
  authDomain: "law-connect-f1080.firebaseapp.com",
  projectId: "law-connect-f1080",
  storageBucket: "law-connect-f1080.firebasestorage.app",
  messagingSenderId: "241641278845",
  appId: "1:241641278845:web:87dc85c4fc08f9230f1014",
  measurementId: "G-8ETKHBJMP4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Validate Email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function handleSignUp(event) {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "signUpMessage");
    return;
  }

  if (password.length < 6) {
    showMessage(
      "Password must be at least 6 characters long.",
      "signUpMessage"
    );
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      showMessage("Account created successfully!", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          showMessage(
            "An error occurred while saving your data. Please try again.",
            "signUpMessage"
          );
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        showMessage(
          "This email address is already in use. Please use a different email.",
          "signUpMessage"
        );
      } else {
        showMessage(
          "An error occurred while creating your account. Please try again.",
          "signUpMessage"
        );
      }
    });
}

function handleSignIn(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "signInMessage");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login successful!", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        showMessage(
          "Incorrect email or password. Please try again.",
          "signInMessage"
        );
      } else {
        showMessage(
          "An error occurred while signing in. Please try again.",
          "signInMessage"
        );
      }
    });
}

document.getElementById("submitSignUp").addEventListener("click", handleSignUp);
document.getElementById("submitSignIn").addEventListener("click", handleSignIn);
