// import all Elements
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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

// Constants for element IDs
const ELEMENT_IDS = {
  loggedUserFName: "loggedUserFName",
  loggedUserEmail: "loggedUserEmail",
  loggedUserLName: "loggedUserLName",
  logoutButton: "logout",
};

// Function to get user data from Firestore
const getUserData = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("No document found matching ID");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

// Function to update UI with user data
const updateUserUI = (userData) => {
  if (userData) {
    document.getElementById(ELEMENT_IDS.loggedUserFName).innerText =
      userData.firstName || "N/A";
    document.getElementById(ELEMENT_IDS.loggedUserEmail).innerText =
      userData.email || "N/A";
    document.getElementById(ELEMENT_IDS.loggedUserLName).innerText =
      userData.lastName || "N/A";
  } else {
    console.warn("User data is null or undefined");
  }
};

// Auth state change listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
      try {
        const userData = await getUserData(loggedInUserId);
        updateUserUI(userData);
      } catch (error) {
        console.error("Error updating user UI:", error);
      }
    } else {
      console.warn("User ID not found in local storage");
    }
  } else {
    console.log("No user is signed in");
  }
});

// Logout button event listener
const logoutButton = document.getElementById(ELEMENT_IDS.logoutButton);
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      localStorage.removeItem("loggedInUserId");
      await signOut(auth);
      window.location.href = "index1.html";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });
} else {
  console.error(
    `Logout button with ID '${ELEMENT_IDS.logoutButton}' not found`
  );
}
