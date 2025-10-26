import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue, remove } from './firebase-config';

const BeerIcon = ({ stage }) => (
  <img 
    src={stage === 'clicking' ? "https://i.imgur.com/pz5ZsvU.png" : "https://i.imgur.com/ewmSdfo.png"} 
    alt="Beer Cheers"
    className="w-full h-full object-contain"
  />
);

const tasksChinese = [
  "用一種動物形容自己",
  "喝完一杯１公升的Laternchen",
  "用「喝酒風格」形容自己（慢品型 / 狂嗨型 / 文青型）",
  "幫某人拍一張最有魅力的照片",
  "請某人幫自己決定下一杯要喝的飲品",
  "告訴大家自己的拿手才藝",
  "跟大家介紹自己（來多久，來幹嘛...)",
  "點一杯Aperol Spritz",
  "跟大家分享上個週末做了什麼事情",
  "喝完一杯Long Drinks",
  "和一個陌生路人乾杯",
  "拿起酒杯和大家自拍",
  "找一個人用酒杯合拍搞怪Pose",
  "找到今晚已經微醺的人，合照留念",
  "在Kessel 點一杯特調Shot",
  "分享自己奇怪的興趣"
];

const tasksEnglish = [
  "Describe yourself as an animal",
  "Finish a 1-liter Laternchen",
  "Describe your drinking style (Sipper / Party Animal / Hipster)",
  "Take the most attractive photo of someone",
  "Let someone choose your next drink",
  "Share your special talent with everyone",
  "Introduce yourself (How long here, what brings you...)",
  "Order an Aperol Spritz",
  "Share what you did last weekend",
  "Finish a Long Drink",
  "Cheers with a stranger",
  "Take a selfie with your drink",
  "Find someone for a funny pose with drinks",
  "Find someone tipsy tonight and take a photo",
  "Order a special shot at Kessel",
  "Share your weird hobby"
];

// Shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Home Page Component
function HomePage({ onStartGame, language, setLanguage }) {
  const [playerName, setPlayerName] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'chinese' ? 'english' : 'chinese');
  };

  const startGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    } else {
      alert(language === 'chinese' ? '請輸入玩家名稱' : 'Please enter player name');
    }
  };

  return (
    <div className="w-full h-screen bg-blue-900 relative overflow-hidden">
      {/* Background image - top half */}
      <div className="absolute top-0 left-0 right-0 h-1/2 z-0">
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo - overlapping background and blue section */}
      <div className="absolute left-0 right-0 top-1/3 z-10 px-4">
        <img 
          src="https://i.imgur.com/2TtbhMD.png"
          alt="Logo"
          className="w-full max-w-md mx-auto"
        />
      </div>

      {/* Input and language button container */}
      <div className="absolute left-0 right-0 bottom-0 z-10 px-6 pb-6 flex flex-col">
        {/* Player name input and language button group */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Player name input */}
          <div className="w-full h-14 rounded-2xl border-2 border-white flex justify-center items-center bg-transparent">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={language === 'chinese' ? '玩家１' : 'Player 1'}
              className="grow shrink basis-0 self-stretch text-center text-white text-base bg-transparent border-none outline-none placeholder-white/70 px-4"
            />
          </div>

          {/* Language toggle button */}
          <button
            onClick={toggleLanguage}
            className="w-full h-14 bg-transparent rounded-2xl border-2 border-white flex justify-center items-center hover:bg-white/10 transition-colors"
          >
            <div className="text-center text-white text-base">
              {language === 'chinese' ? 'English' : '中文'}
            </div>
          </button>
        </div>

        {/* Start game button - 40px gap from above, 24px from bottom */}
        <button
          onClick={startGame}
          className="w-full h-14 rounded-2xl shadow-lg relative overflow-hidden hover:opacity-90 transition-opacity"
        >
          <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400" />
          <div className="relative text-center text-black text-lg font-bold">
            {language === 'chinese' ? '開始Bingo!' : 'Start Bingo!'}
          </div>
        </button>
      </div>
    </div>
  );
}

// Progress View Page Component
function ProgressViewPage({ onBack, progressData, language, playerName }) {
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate percentage for progress bar
  const calculatePercentage = (lines, extraBoxes) => {
    const totalBoxes = (lines * 4) + extraBoxes;
    return Math.round((totalBoxes / 16) * 100);
  };

  // 即時監聽所有玩家資料
  useEffect(() => {
    console.log('📡 開始即時監聽 Firebase 資料...');
    const playersRef = ref(database, 'players');
    
    // 使用 onValue 持續監聽
    const unsubscribe = onValue(playersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log('📥 收到 Firebase 資料:', data);
        
        if (!data) {
          console.log('⚠️ 沒有玩家資料');
          setAllPlayers([]);
          setIsLoading(false);
          return;
        }
        
        const playersData = [];
        
        // 轉換物件為陣列（顯示所有玩家，不過濾）
        for (const [name, playerData] of Object.entries(data)) {
          playerData.percentage = calculatePercentage(playerData.lines, playerData.extraBoxes);
          playersData.push(playerData);
        }
        
        console.log('✅ 處理後的玩家資料:', playersData);
        
        // 排序：先按線數，再按額外格子數
        playersData.sort((a, b) => {
          if (b.lines !== a.lines) return b.lines - a.lines;
          return b.extraBoxes - a.extraBoxes;
        });
        
        setAllPlayers(playersData);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ 處理 Firebase 資料時出錯:', error);
        setIsLoading(false);
      }
    }, (error) => {
      console.error('❌ Firebase 監聽錯誤:', error);
      setIsLoading(false);
    });
    
    // 清理函數：離開頁面時取消監聽
    return () => {
      console.log('🔌 取消 Firebase 監聽');
      unsubscribe();
    };
  }, []);

  const formatProgress = (lines, extraBoxes, lang) => {
    if (lines === 0) {
      return extraBoxes > 0 
        ? (lang === 'chinese' ? `${extraBoxes}格` : `${extraBoxes} boxes`)
        : (lang === 'chinese' ? '0條線' : '0 lines');
    } else if (lines === 3) {
      return lang === 'chinese' ? '3條線' : '3 lines';
    } else {
      return extraBoxes > 0
        ? (lang === 'chinese' ? `${lines}條線+${extraBoxes}格` : `${lines} lines+${extraBoxes}`)
        : (lang === 'chinese' ? `${lines}條線` : `${lines} lines`);
    }
  };

  return (
    <div className="w-full h-screen bg-blue-900 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-4 z-30 w-10 h-10 bg-indigo-700 rounded-full shadow flex items-center justify-center hover:bg-indigo-600 transition-colors"
      >
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Content container */}
      <div className="relative z-10 px-4 pt-20 pb-8 h-full overflow-y-auto">
        {/* My Progress Card */}
        <div className="bg-white/95 rounded-2xl p-4 mb-4">
          <div className="text-black text-base font-bold mb-2">
            {language === 'chinese' ? '我的進度:' : 'My Progress:'}
          </div>
          <div className="text-black text-2xl font-bold mb-2">{playerName}</div>
          <div className="text-black text-sm mb-2">
            {formatProgress(progressData.lines, progressData.extraBoxes, language)}
          </div>
          <div className="relative w-full h-8 bg-white rounded-2xl border border-blue-900 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-yellow-400 rounded-2xl transition-all duration-300"
              style={{ width: `${calculatePercentage(progressData.lines, progressData.extraBoxes)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-black text-base font-bold">
              {calculatePercentage(progressData.lines, progressData.extraBoxes)}%
            </div>
          </div>
        </div>

        {/* Other Players Progress Card */}
        <div className="bg-white/95 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-black text-base font-bold">
              {language === 'chinese' ? '所有玩家進度:' : 'All Players Progress:'}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-gray-500 text-xs">
                {language === 'chinese' ? '即時更新' : 'Live'}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">
              {language === 'chinese' ? '載入中...' : 'Loading...'}
            </div>
          ) : allPlayers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              {language === 'chinese' ? '目前沒有玩家' : 'No players yet'}
            </div>
          ) : (
            <div className="space-y-4">
              {allPlayers.map((player, index) => {
                const isMe = player.playerName === playerName;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className={`text-black text-base ${isMe ? 'font-bold' : ''}`}>
                        {player.playerName} {isMe && (language === 'chinese' ? '(你)' : '(You)')}
                      </div>
                      <div className="text-black text-sm">
                        {formatProgress(player.lines, player.extraBoxes, language)}
                      </div>
                    </div>
                    <div className="relative w-full h-8 bg-white rounded-2xl border border-blue-900 overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-yellow-400 rounded-2xl transition-all duration-300"
                        style={{ width: `${player.percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-black text-base font-bold">
                        {player.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Game Component
export default function GamePage() {
  const [language, setLanguage] = useState('chinese');
  const [gameState, setGameState] = useState('home'); // 'home', 'game', 'progress'
  const [playerName, setPlayerName] = useState('');
  const [shuffledTasks, setShuffledTasks] = useState([]);
  const [taskStates, setTaskStates] = useState(Array(16).fill('default'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);
  const [progressData, setProgressData] = useState({ lines: 0, extraBoxes: 0 });

  const tasks = language === 'chinese' ? tasksChinese : tasksEnglish;

  // 🔥 立即初始化任務（在組件載入時）
  useEffect(() => {
    console.log('🎮 初始化任務列表...');
    if (tasks.length === 0) {
      console.log('⚠️ 任務列表為空，等待載入...');
      return;
    }
    
    const savedTasks = localStorage.getItem('barHoppingTasks');
    
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (parsed.length === 16) {
          console.log('✅ 載入已保存的任務');
          setShuffledTasks(parsed);
          return;
        }
      } catch (e) {
        console.log('⚠️ 解析保存的任務失敗');
      }
    }
    
    // 如果沒有保存的任務或載入失敗，創建新的
    console.log('🔀 創建新的任務順序');
    const newShuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
    setShuffledTasks(newShuffled);
  }, [language]); // 只在語言改變時重新初始化

  // 🔥 檢查是否有保存的玩家名稱，如果有則直接進入遊戲
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      console.log('👤 發現已保存的玩家:', savedPlayerName);
      setPlayerName(savedPlayerName);
      setGameState('game');
    }
  }, []);

  // 🔥 載入已保存的任務狀態
  useEffect(() => {
    const savedStates = localStorage.getItem('barHoppingStates');
    if (savedStates) {
      try {
        const parsed = JSON.parse(savedStates);
        console.log('✅ 載入已保存的任務狀態');
        setTaskStates(parsed);
      } catch (e) {
        console.log('⚠️ 解析任務狀態失敗');
      }
    }
  }, []);

  // Save task states to localStorage whenever they change
  useEffect(() => {
    if (taskStates.some(state => state !== 'default')) {
      localStorage.setItem('barHoppingStates', JSON.stringify(taskStates));
    }
  }, [taskStates]);

  // Update tasks when language changes
  useEffect(() => {
    if (shuffledTasks.length > 0) {
      const newShuffled = shuffleArray(tasks);
      localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
      setShuffledTasks(newShuffled);
    }
  }, [language, tasks]);

  // Calculate and update progress data whenever task states change
  useEffect(() => {
    const finishedIndices = taskStates
      .map((state, idx) => state === 'finished' ? idx : -1)
      .filter(idx => idx !== -1);
    
    let lines = 0;
    
    // Check rows
    for (let row = 0; row < 4; row++) {
      const rowIndices = [row * 4, row * 4 + 1, row * 4 + 2, row * 4 + 3];
      if (rowIndices.every(idx => finishedIndices.includes(idx))) {
        lines++;
      }
    }
    
    // Check columns
    for (let col = 0; col < 4; col++) {
      const colIndices = [col, col + 4, col + 8, col + 12];
      if (colIndices.every(idx => finishedIndices.includes(idx))) {
        lines++;
      }
    }
    
    // Check diagonals
    const diag1 = [0, 5, 10, 15];
    const diag2 = [3, 6, 9, 12];
    if (diag1.every(idx => finishedIndices.includes(idx))) {
      lines++;
    }
    if (diag2.every(idx => finishedIndices.includes(idx))) {
      lines++;
    }
    
    const finishedCount = finishedIndices.length;
    const extraBoxes = Math.max(0, finishedCount - (lines * 4));
    
    console.log('📊 進度更新:', { lines, extraBoxes, finishedCount });
    setProgressData({ lines, extraBoxes });

    // 🔥 同步到 Firebase
    if (playerName && gameState === 'game') {
      console.log('📤 準備同步進度到 Firebase...');
      saveProgressToSharedStorage({ lines, extraBoxes });
    } else {
      console.log('⚠️ 跳過同步:', { playerName, gameState });
    }
  }, [taskStates, playerName, gameState]);

  // 🔥 新增：同步進度到 Firebase Realtime Database
  const saveProgressToSharedStorage = async (progress) => {
    try {
      console.log('🔥 開始同步到 Firebase...', { playerName, progress });
      
      const progressDataToSave = {
        playerName: playerName,
        lines: progress.lines,
        extraBoxes: progress.extraBoxes,
        timestamp: Date.now()
      };
      
      // 使用 Firebase 儲存玩家進度
      const playerRef = ref(database, `players/${playerName}`);
      await set(playerRef, progressDataToSave);
      
      console.log('✅ Firebase 同步成功:', progressDataToSave);
    } catch (error) {
      console.error('❌ Firebase 同步失敗:', error);
      console.error('錯誤詳情:', {
        message: error.message,
        code: error.code,
        playerName: playerName,
        progress: progress
      });
    }
  };

  const handleStartGame = (name) => {
    console.log('🎮 遊戲開始，玩家:', name);
    setPlayerName(name);
    setGameState('game');
    
    // 保存玩家名稱到 localStorage
    localStorage.setItem('playerName', name);
    
    // 🔥 遊戲開始時立即同步初始進度
    setTimeout(() => {
      console.log('📤 同步初始進度...');
      saveProgressToSharedStorage({ lines: 0, extraBoxes: 0 });
    }, 100);
  };

  const handleViewProgress = () => {
    setGameState('progress');
  };

  const handleBackToGame = () => {
    setGameState('game');
  };

  const checkForBingo = (states) => {
    const finishedIndices = states
      .map((state, idx) => state === 'finished' ? idx : -1)
      .filter(idx => idx !== -1);
    
    let completedLines = 0;
    
    // Check rows
    for (let row = 0; row < 4; row++) {
      const rowIndices = [row * 4, row * 4 + 1, row * 4 + 2, row * 4 + 3];
      if (rowIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
      }
    }
    
    // Check columns
    for (let col = 0; col < 4; col++) {
      const colIndices = [col, col + 4, col + 8, col + 12];
      if (colIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
      }
    }
    
    // Check diagonals
    const diag1 = [0, 5, 10, 15];
    const diag2 = [3, 6, 9, 12];
    if (diag1.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
    }
    if (diag2.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
    }
    
    // Return true only if 3 or more lines are completed
    return completedLines >= 3;
  };

  const handleTaskClick = (index) => {
    const currentState = taskStates[index];
    
    if (currentState === 'default') {
      // Show "clicking" state with icon 1
      const newStates = [...taskStates];
      newStates[index] = 'clicking';
      setTaskStates(newStates);
      
      // After 500ms, change to finished with icon 2
      const timer = setTimeout(() => {
        setTaskStates(prevStates => {
          const updatedStates = [...prevStates];
          updatedStates[index] = 'finished';
          
          // Check for bingo after state update
          if (checkForBingo(updatedStates)) {
            setTimeout(() => {
              setShowCelebration(true);
              setCelebrationStage(0);
            }, 300);
          }
          
          return updatedStates;
        });
      }, 500);

      // Store timer to clean up if needed
      return () => clearTimeout(timer);
    } else if (currentState === 'finished' || currentState === 'clicking') {
      // Reset to default (allow reset even if stuck in clicking)
      const newStates = [...taskStates];
      newStates[index] = 'default';
      setTaskStates(newStates);
    }
  };

  const handleReset = async () => {
    // Clear localStorage - 清除所有遊戲資料
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    localStorage.removeItem('playerName');
    
    // 從 Firebase 中移除當前玩家
    if (playerName) {
      try {
        const playerRef = ref(database, `players/${playerName}`);
        await remove(playerRef);
        console.log('✅ Player removed from Firebase');
      } catch (error) {
        console.log('❌ Could not remove from Firebase:', error);
      }
    }
    
    // Reset all states
    setPlayerName('');
    setShuffledTasks([]);
    setTaskStates(Array(16).fill('default'));
    setShowCelebration(false);
    setCelebrationStage(0);
    setProgressData({ lines: 0, extraBoxes: 0 });
    
    // 回到首頁
    setGameState('home');
  };

  useEffect(() => {
    if (showCelebration) {
      if (celebrationStage === 0) {
        setTimeout(() => setCelebrationStage(1), 500);
      } else if (celebrationStage === 1) {
        setTimeout(() => setCelebrationStage(2), 800);
      }
    }
  }, [showCelebration, celebrationStage]);

  // Show home page if game hasn't started
  if (gameState === 'home') {
    return <HomePage onStartGame={handleStartGame} language={language} setLanguage={setLanguage} />;
  }

  // Show progress view page
  if (gameState === 'progress') {
    return <ProgressViewPage onBack={handleBackToGame} progressData={progressData} language={language} playerName={playerName} />;
  }

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="w-full h-screen bg-blue-900 relative overflow-hidden flex items-center justify-center">
        {/* Background image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
        
        {/* Logo at top - stays within screen */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 max-w-xs w-full px-4">
          <img 
            src="https://i.imgur.com/2TtbhMD.png" 
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Celebration beer king - can overflow screen */}
        <div 
          className="relative z-10 transition-all duration-1000 ease-out"
          style={{
            transform: `scale(${celebrationStage === 0 ? 0.5 : celebrationStage === 1 ? 1.5 : 2.5}) rotate(${celebrationStage * 180}deg)`,
            opacity: celebrationStage === 0 ? 0.5 : 1
          }}
        >
          <img 
            src="https://i.imgur.com/cIJ8iBP.png"
            alt="Beer King"
            className="w-80 h-80 object-contain"
          />
        </div>

        {/* Close button - stays within screen */}
        <button
          onClick={() => setShowCelebration(false)}
          className="absolute top-4 right-4 z-30 bg-white text-gray-800 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm"
        >
          {language === 'chinese' ? '關閉' : 'Close'}
        </button>

        {/* Reset button at bottom - stays within screen with safe area */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6">
          <button
            onClick={handleReset}
            className="w-full h-8 bg-white text-black border-2 border-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {language === 'chinese' ? '重新開始遊戲' : 'Start New Game'}
          </button>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="w-full min-h-screen bg-blue-900 relative overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Party Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo - clickable to view progress */}
      <button 
        onClick={handleViewProgress}
        className="absolute top-8 left-5 right-5 z-20 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <img 
          src="https://i.imgur.com/2TtbhMD.png"
          alt="Logo"
          className="w-full h-auto drop-shadow-2xl"
        />
      </button>

      {/* Main content */}
      <div className="relative z-10 px-5 pt-32 pb-8 min-h-screen">
        {/* White background container - extended top to overlap with logo */}
        <div className="bg-white/95 rounded-2xl pt-32 px-4 pb-4 shadow-2xl w-full max-w-md mx-auto">

          {/* 4x4 Grid with min-width 64px and dynamic sizing */}
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex justify-between gap-2">
                {[0, 1, 2, 3].map((col) => {
                  const index = row * 4 + col;
                  const task = shuffledTasks[index];
                  return (
                    <button
                      key={index}
                      onClick={() => handleTaskClick(index)}
                      className={`
                        flex-1 min-w-[64px] min-h-24 p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center
                        ${taskStates[index] === 'default' ? 'bg-white border-2 border-black hover:bg-gray-50' : ''}
                        ${taskStates[index] === 'clicking' ? 'bg-white border-2 border-green-500 scale-95 h-24' : ''}
                        ${taskStates[index] === 'finished' ? 'bg-white border-2 border-green-600 h-24' : ''}
                      `}
                    >
                      {taskStates[index] === 'default' && (
                        <div className="text-xs leading-tight text-center text-black">
                          {task}
                        </div>
                      )}
                      
                      {taskStates[index] === 'clicking' && (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <BeerIcon stage="clicking" />
                        </div>
                      )}
                      
                      {taskStates[index] === 'finished' && (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <BeerIcon stage="finished" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
