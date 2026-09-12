import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCZ47p3iI5uqoPu46o8GqLxojJf2AKHxas',
  authDomain: 'kaun-banega-einstein.firebaseapp.com',
  projectId: 'kaun-banega-einstein',
  storageBucket: 'kaun-banega-einstein.firebasestorage.app',
  messagingSenderId: '768528566833',
  appId: '1:768528566833:web:27f1bfc38ab37aa6b22310',
  measurementId: 'G-RC84EV6WD8',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firestore = getFirestore(firebaseApp);