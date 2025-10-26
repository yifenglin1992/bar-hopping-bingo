// Firebase 配置文件
// 請將下面的配置替換為您自己的 Firebase 專案配置

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, get } from 'firebase/database';

// 您的 Firebase 配置（從 Firebase Console 獲取）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, remove, get };
