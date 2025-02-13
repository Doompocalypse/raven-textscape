
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBrHuVwnW9UFAQPMPjDz0asvT1VlUYwI0E",
  authDomain: "raven-ai-llama70b.firebaseapp.com",
  projectId: "raven-ai-llama70b",
  storageBucket: "raven-ai-llama70b.applestorage.app",
  messagingSenderId: "570488671645",
  appId: "1:570488671645:web:f8bf58856258d7d01af374",
  measurementId: "G-2W7EXEP7Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
