import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCYjCLM5OAmHpyvF6C2BcKPRLOyogt4XOM",
  authDomain: "controle-atividades-dev-mobile.firebaseapp.com",
  projectId: "controle-atividades-dev-mobile",
  storageBucket: "controle-atividades-dev-mobile.firebasestorage.app",
  messagingSenderId: "908750046522",
  appId: "1:908750046522:web:f0b4ce4ff4a40119ae7c03"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };