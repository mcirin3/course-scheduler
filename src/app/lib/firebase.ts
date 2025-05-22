import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmxUXh-vbSLLUSwgcvWpCJBu2YbZuT-2o",
  authDomain: "course-scheduler-7c9bd.firebaseapp.com",
  projectId: "course-scheduler-7c9bd",
  storageBucket: "course-scheduler-7c9bd.firebasestorage.app",
  messagingSenderId: "497802490180",
  appId: "1:497802490180:web:6022ff3148822ff468e711",
  measurementId: "G-3SYJJ0X3FQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
