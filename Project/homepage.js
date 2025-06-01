import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    //YOUR COPIED FIREBASE PART SHOULD BE HERE
    apiKey: "AIzaSyDG4B6Bv5_GbYQNRksGlSeYyRRXbOIOS4Q",
    authDomain: "im-final-project-9abb3.firebaseapp.com",
    projectId: "im-final-project-9abb3",
    storageBucket: "im-final-project-9abb3.firebasestorage.app",
    messagingSenderId: "999122786889",
    appId: "1:999122786889:web:392cada477bb4f3cf4fd98"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const db = getFirestore();

  // Add a flag to track initial load
  let isInitialLoad = true;

  onAuthStateChanged(auth, (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef)
        .then((docSnap) => {
            if(docSnap.exists()) {
                const userData = docSnap.data();
                
                // Update welcome message if on homepage
                const welcomeMessage = document.getElementById('welcomeMessage');
                if (welcomeMessage) {
                    if (isInitialLoad) {
                        if (!userData.lastLogin) {
                            welcomeMessage.innerText = `Welcome ${userData.firstName}!`;
                            updateDoc(docRef, {
                                lastLogin: new Date().toISOString()
                            });
                        } else {
                            welcomeMessage.innerText = `Welcome back, ${userData.firstName}!`;
                        }
                        isInitialLoad = false;
                    }
                }

                // Update user info elements if they exist
                const userFName = document.getElementById('loggedUserFName');
                const userEmail = document.getElementById('loggedUserEmail');
                const userLName = document.getElementById('loggedUserLName');

                if (userFName) userFName.innerText = userData.firstName;
                if (userEmail) userEmail.innerText = userData.email;
                if (userLName) userLName.innerText = userData.lastName;
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
    } else if (!isInitialLoad) {
        window.location.href = 'index.html';
    }
});

// Update logout handler
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error Signing out:', error);
    });
});
