import React, { useState, useEffect } from 'react';

// BeerIcon Component
const BeerIcon = ({ stage }) => (
  <img 
    src={stage === 'clicking' ? "https://i.imgur.com/pz5ZsvU.png" : "https://i.imgur.com/ewmSdfo.png"} 
    alt="Beer Cheers"
    className="w-full h-full object-contain"
  />
);

// Task Lists
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
              {language === 'chinese' ? '語言: 中文' : 'Language: English'}
            </div>
          </button>
        </div>

        {/* Start game button */}
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

  // Load all players data
  const loadAllPlayers = async () => {
    try {
      const result = await window.storage.list('bingo_player:', true);
      if (result && result.keys) {
        const playersData = [];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const key of result.keys) {
          try {
            const data = await window.storage.get(key, true);
            if (data && data.value) {
              const playerData = JSON.parse(data.value);
              if (playerData.timestamp > oneHourAgo) {
                playersData.push(playerData);
              }
            }
          } catch (e) {
            console.log('Could not load player:', key);
          }
        }
        
        playersData.sort((a, b) => {
          if (b.lines !== a.lines) return b.lines - a.lines;
          return b.extraBoxes - a.extraBoxes;
        });
        
        setAllPlayers(playersData);
      }
    } catch (error) {
      console.log('Storage not available or error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllPlayers();
    const interval = setInterval(loadAllPlayers, 5000);
    return () => clearInterval(interval);
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
          <div className="text-black text-sm mb-2">
            {formatProgress(progressData.lines, progressData.extraBoxes, language)}
          </div>
          <div className="relative w-full h-8 bg-white rounded-2xl border border-blue-900 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-yellow-400 rounded-2xl transition-all duration-300"
              style={{ width: `${progressData.percentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-black text-base font-bold">
              {progressData.percentage}%
            </div>
          </div>
        </div>

        {/* Other Players Progress Card */}
        <div className="bg-white/95 rounded-2xl p-4 mb-4">
          <div className="text-black text-base font-bold mb-4">
            {language === 'chinese' ? '其他玩家進度:' : 'Other Players Progress:'}
          </div>
          
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">
              {language === 'chinese' ? '載入中...' : 'Loading...'}
            </div>
          ) : allPlayers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              {language === 'chinese' ? '目前沒有其他玩家' : 'No other players yet'}
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

// Main App Component
export default function App() {
  // Game state: 'home', 'playing', or 'progress'
  const [gameState, setGameState] = useState(() => {
    // 從 localStorage 恢復 gameState，若無則預設為 'home'
    return localStorage.getItem('barHoppingGameState') || 'home';
  });
  const [playerName, setPlayerName] = useState(() => {
    // 從 localStorage 恢復 playerName
    return localStorage.getItem('barHoppingPlayerName') || '';
  });

  // Language state
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('barHoppingLanguage') || 'chinese';
  });

  // Get current tasks based on language
  const tasks = language === 'chinese' ? tasksChinese : tasksEnglish;

  // Get or create shuffled tasks from localStorage
  const [shuffledTasks, setShuffledTasks] = useState(() => {
    const savedTasks = localStorage.getItem('barHoppingTasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      const shuffled = shuffleArray(tasks);
      localStorage.setItem('barHoppingTasks', JSON.stringify(shuffled));
      return shuffled;
    }
  });

  // Get or create task states from localStorage - fix stuck "clicking" states
  const [taskStates, setTaskStates] = useState(() => {
    const savedStates = localStorage.getItem('barHoppingStates');
    if (savedStates) {
      const states = JSON.parse(savedStates);
      return states.map(state => state === 'clicking' ? 'default' : state);
    }
    return Array(16).fill('default');
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);

  // 儲存 gameState 和 playerName 到 localStorage
  useEffect(() => {
    localStorage.setItem('barHoppingGameState', gameState);
    localStorage.setItem('barHoppingPlayerName', playerName);
  }, [gameState, playerName]);

  // Calculate progress with lines and extra boxes
  const calculateProgressWithLines = () => {
    const finishedIndices = taskStates.map((state, idx) => state === 'finished' ? idx : -1).filter(idx => idx !== -1);
    
    let completedLines = 0;
    const completedBoxIndices = new Set();
    
    // Check rows
    for (let row = 0; row < 4; row++) {
      const rowIndices = [row * 4, row * 4 + 1, row * 4 + 2, row * 4 + 3];
      if (rowIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
        rowIndices.forEach(idx => completedBoxIndices.add(idx));
      }
    }
    
    // Check columns
    for (let col = 0; col < 4; col++) {
      const colIndices = [col, col + 4, col + 8, col + 12];
      if (colIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
        colIndices.forEach(idx => completedBoxIndices.add(idx));
      }
    }
    
    // Check diagonals
    const diag1 = [0, 5, 10, 15];
    const diag2 = [3, 6, 9, 12];
    if (diag1.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
      diag1.forEach(idx => completedBoxIndices.add(idx));
    }
    if (diag2.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
      diag2.forEach(idx => completedBoxIndices.add(idx));
    }
    
    // Calculate extra boxes
    const extraBoxes = finishedIndices.filter(idx => !completedBoxIndices.has(idx)).length;
    
    // Calculate percentage for progress bar
    const lineProgress = (completedLines / 3) * 100;
    const boxProgress = (extraBoxes / 16) * 33.33;
    const totalProgress = Math.min(lineProgress + boxProgress, 100);
    
    return {
      lines: completedLines,
      extraBoxes: extraBoxes,
      percentage: Math.round(totalProgress)
    };
  };

  const progressData = calculateProgressWithLines();

  // Save player data to shared storage
  const savePlayerData = async () => {
    if (!playerName) return;
    
    try {
      const playerData = {
        playerName,
        lines: progressData.lines,
        extraBoxes: progressData.extraBoxes,
        percentage: progressData.percentage,
        timestamp: Date.now()
      };
      
      const key = `bingo_player:${playerName}`;
      await window.storage.set(key, JSON.stringify(playerData), true);
    } catch (error) {
      console.log('Could not save player data:', error);
    }
  };

  // Save task states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('barHoppingStates', JSON.stringify(taskStates));
    if (gameState === 'playing') {
      savePlayerData();
    }
  }, [taskStates]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('barHoppingLanguage', language);
  }, [language]);

  // Handle start game with reset
  const handleStartGame = (name) => {
    setPlayerName(name);
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    const newShuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
    setShuffledTasks(newShuffled);
    const resetStates = Array(16).fill('default');
    localStorage.setItem('barHoppingStates', JSON.stringify(resetStates));
    setTaskStates(resetStates);
    setGameState('playing');
  };

  // Handle view progress
  const handleViewProgress = () => {
    setGameState('progress');
  };

  // Handle back to game
  const handleBackToGame = () => {
    setGameState('playing');
  };

  // Toggle language and update tasks
  const toggleLanguage = () => {
    const newLanguage = language === 'chinese' ? 'english' : 'chinese';
    setLanguage(newLanguage);
    const newTasks = newLanguage === 'chinese' ? tasksChinese : tasksEnglish;
    const newShuffled = shuffleArray(newTasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
    setShuffledTasks(newShuffled);
  };

  const checkForBingo = (states) => {
    const finishedIndices = states.map((state, idx) => state === 'finished' ? idx : -1).filter(idx => idx !== -1);
    
    let completedLines = 0;
    
    for (let row = 0; row < 4; row++) {
      const rowIndices = [row * 4, row * 4 + 1, row * 4 + 2, row * 4 + 3];
      if (rowIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
      }
    }
    
    for (let col = 0; col < 4; col++) {
      const colIndices = [col, col + 4, col + 8, col + 12];
      if (colIndices.every(idx => finishedIndices.includes(idx))) {
        completedLines++;
      }
    }
    
    const diag1 = [0, 5, 10, 15];
    const diag2 = [3, 6, 9, 12];
    if (diag1.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
    }
    if (diag2.every(idx => finishedIndices.includes(idx))) {
      completedLines++;
    }
    
    return completedLines >= 3;
  };

  const handleTaskClick = (index) => {
    const currentState = taskStates[index];
    
    if (currentState === 'default') {
      const newStates = [...taskStates];
      newStates[index] = 'clicking';
      setTaskStates(newStates);
      
      const timer = setTimeout(() => {
        setTaskStates(prevStates => {
          const updatedStates = [...prevStates];
          updatedStates[index] = 'finished';
          
          if (checkForBingo(updatedStates)) {
            setTimeout(() => {
              setShowCelebration(true);
              setCelebrationStage(0);
            }, 300);
          }
          
          return updatedStates;
        });
      }, 500);

      return () => clearTimeout(timer);
    } else if (currentState === 'finished' || currentState === 'clicking') {
      const newStates = [...taskStates];
      newStates[index] = 'default';
      setTaskStates(newStates);
    }
  };

  const handleReset = () => {
    // 清空 localStorage
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    localStorage.removeItem('barHoppingGameState');
    localStorage.removeItem('barHoppingPlayerName');
    
    // 重置任務和狀態
    const newShuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
    setShuffledTasks(newShuffled);
    const resetStates = Array(16).fill('default');
    localStorage.setItem('barHoppingStates', JSON.stringify(resetStates));
    setTaskStates(resetStates);
    
    // 重置遊戲狀態回到首頁
    setGameState('home');
    setPlayerName('');
    setShowCelebration(false);
    setCelebrationStage(0);
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

  // Show home page if game hasn't started or reset
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
        
        {/* Logo at top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 max-w-xs w-full px-4">
          <img 
            src="https://i.imgur.com/2TtbhMD.png" 
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Celebration beer king */}
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

        {/* Close button */}
        <button
          onClick={() => setShowCelebration(false)}
          className="absolute top-4 right-4 z-30 bg-white text-gray-800 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm"
        >
          {language === 'chinese' ? '關閉' : 'Close'}
        </button>

        {/* Restart game button */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6">
          <button
            onClick={handleReset}
            className="w-full h-8 bg-white text-black border-2 border-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {language === 'chinese' ? '重新開始遊戲' : 'Restart Game'}
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
        <div className="bg-white/95 rounded-2xl pt-32 px-4 pb-4 shadow-2xl w-full max-w-md mx-auto">
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
