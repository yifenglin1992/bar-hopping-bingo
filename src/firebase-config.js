import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

// 🔥 把您剛才複製的 Firebase 配置貼在這裡
const firebaseConfig = {
  apiKey: "AIzaSyCzYsOqbRSgvKe0ey7ORJijB6ENTMTwjSw",
  authDomain: "bar-hopping-bingo-74b10.firebaseapp.com",
  databaseURL: "https://bar-hopping-bingo-74b10-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bar-hopping-bingo-74b10",
  storageBucket: "bar-hopping-bingo-74b10.firebasestorage.app",
  messagingSenderId: "356791310307",
  appId: "1:356791310307:web:90c544cdf00f69b3deb2d6"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, remove };
