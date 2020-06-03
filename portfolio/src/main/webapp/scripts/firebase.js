// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClgPoY4yY5QHY3DoLc1JD9zedf__TQnF0",
  authDomain: "scarletnguyen-step-2020.firebaseapp.com",
  databaseURL: "https://scarletnguyen-step-2020.firebaseio.com",
  projectId: "scarletnguyen-step-2020",
  storageBucket: "scarletnguyen-step-2020.appspot.com",
  messagingSenderId: "665545798239",
  appId: "1:665545798239:web:948c53e561d94c4526e1ea",
  measurementId: "G-R14Y7Z2VZK"
};

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export { app };