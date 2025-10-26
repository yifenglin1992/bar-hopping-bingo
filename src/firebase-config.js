// Firebase 配置文件
// 請將下面的配置替換為您自己的 Firebase 專案配置

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, get } from 'firebase/database';

// 您的 Firebase 配置（從 Firebase Console 獲取）
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

export { database, ref, set, onValue, remove, get };
