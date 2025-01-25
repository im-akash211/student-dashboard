import { initializeApp} from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAYDEN2IlyowbhbSfwUdM2JLl2gjkcLbnM",
    authDomain: "student-dashboard-9b303.firebaseapp.com",
    projectId: "student-dashboard-9b303",
    storageBucket: "student-dashboard-9b303.firebasestorage.app",
    messagingSenderId: "604853354016",
    appId: "1:604853354016:web:284da19279402dab094645"
  };

  export const app = initializeApp(firebaseConfig)