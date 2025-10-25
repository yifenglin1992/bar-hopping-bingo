import React, { useState, useEffect } from 'react';

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

// ---------------- Home Page ----------------
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
      {/* Background image */}
      <div className="absolute top-0 left-0 right-0 h-1/2 z-0">
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo */}
      <div className="absolute left-0 right-0 top-1/3 z-10 px-4">
        <img 
          src="https://i.imgur.com/2TtbhMD.png"
          alt="Logo"
          className="w-full max-w-md mx-auto"
        />
      </div>

      {/* Input & Buttons */}
      <div className="absolute left-0 right-0 bottom-0 z-10 px-6 pb-6 flex flex-col">
        <div className="flex flex-col gap-4 mb-10">
          <div className="w-full h-14 rounded-2xl border-2 border-white flex justify-center items-center bg-transparent">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={language === 'chinese' ? '玩家１' : 'Player 1'}
              className="grow text-center text-white text-base bg-transparent border-none outline-none placeholder-white/70 px-4"
            />
          </div>

          <button
            onClick={toggleLanguage}
            className="w-full h-14 bg-transparent rounded-2xl border-2 border-white flex justify-center items-center hover:bg-white/10 transition-colors"
          >
            <div className="text-center text-white text-base">
              {language === 'chinese' ? '語言: 中文' : 'Language: English'}
            </div>
          </button>
        </div>

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

// ---------------- Progress Page ----------------
function ProgressViewPage({ onBack, progressData, language, playerName }) {
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          } catch {}
        }
        
        playersData.sort((a, b) => {
          if (b.lines !== a.lines) return b.lines - a.lines;
          return b.extraBoxes - a.extraBoxes;
        });
        
        setAllPlayers(playersData);
      }
    } catch {
      console.log('Storage not available or error');
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
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={onBack}
        className="absolute top-8 left-4 z-30 w-10 h-10 bg-indigo-700 rounded-full shadow flex items-center justify-center hover:bg-indigo-600 transition-colors"
      >
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="relative z-10 px-4 pt-20 pb-8 h-full overflow-y-auto">
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

// ---------------- Main App ----------------
export default function App() {
  // 保留上次頁面狀態
  const [gameState, setGameState] = useState(() => {
    return localStorage.getItem('barHoppingGameState') || 'home';
  });
  useEffect(() => {
    localStorage.setItem('barHoppingGameState', gameState);
  }, [gameState]);

  const [playerName, setPlayerName] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('barHoppingLanguage') || 'chinese');
  const tasks = language === 'chinese' ? tasksChinese : tasksEnglish;

  const [shuffledTasks, setShuffledTasks] = useState(() => {
    const saved = localStorage.getItem('barHoppingTasks');
    if (saved) return JSON.parse(saved);
    const shuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(shuffled));
    return shuffled;
  });

  const [taskStates, setTaskStates] = useState(() => {
    const savedStates = localStorage.getItem('barHoppingStates');
    if (savedStates) {
      const states = JSON.parse(savedStates);
      return states.map(s => s === 'clicking' ? 'default' : s);
    }
    return Array(16).fill('default');
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);

  // 計算進度
  const calculateProgressWithLines = () => {
    const finished = taskStates.map((s, i) => s === 'finished' ? i : -1).filter(i => i !== -1);
    let lines = 0;
    const boxes = new Set();

    for (let r = 0; r < 4; r++) {
      const row = [r*4, r*4+1, r*4+2, r*4+3];
      if (row.every(i => finished.includes(i))) { lines++; row.forEach(i => boxes.add(i)); }
    }
    for (let c = 0; c < 4; c++) {
      const col = [c, c+4, c+8, c+12];
      if (col.every(i => finished.includes(i))) { lines++; col.forEach(i => boxes.add(i)); }
    }
    const diag1 = [0,5,10,15], diag2 = [3,6,9,12];
    if (diag1.every(i => finished.includes(i))) { lines++; diag1.forEach(i => boxes.add(i)); }
    if (diag2.every(i => finished.includes(i))) { lines++; diag2.forEach(i => boxes.add(i)); }

    const extra = finished.filter(i => !boxes.has(i)).length;
    const pct = Math.min((lines/3)*100 + (extra/16)*33.33, 100);
    return { lines, extraBoxes: extra, percentage: Math.round(pct) };
  };

  const progressData = calculateProgressWithLines();

  const savePlayerData = async () => {
    if (!playerName) return;
    try {
      const data = {
        playerName,
        lines: progressData.lines,
        extraBoxes: progressData.extraBoxes,
        percentage: progressData.percentage,
        timestamp: Date.now()
      };
      await window.storage.set(`bingo_player:${playerName}`, JSON.stringify(data), true);
    } catch (e) {
      console.log('Save error', e);
    }
  };

  useEffect(() => {
    localStorage.setItem('barHoppingStates', JSON.stringify(taskStates));
    if (gameState === 'playing') savePlayerData();
  }, [taskStates]);

  useEffect(() => localStorage.setItem('barHoppingLanguage', language), [language]);

  // --------- Handlers ---------
  const handleStartGame = (name) => {
    setPlayerName(name);
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    const shuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(shuffled));
    setShuffledTasks(shuffled);
    const reset = Array(16).fill('default');
    localStorage.setItem('barHoppingStates', JSON.stringify(reset));
    setTaskStates(reset);
    setGameState('playing');
  };

  const handleViewProgress = () => setGameState('progress');
  const handleBackToGame = () => setGameState('playing');

  const checkForBingo = (states) => {
    const finished = states.map((s, i) => s === 'finished' ? i : -1).filter(i => i !== -1);
    let lines = 0;
    for (let r = 0; r < 4; r++) {
      if ([r*4, r*4+1, r*4+2, r*4+3].every(i => finished.includes(i))) lines++;
    }
    for (let c = 0; c < 4; c++) {
      if ([c,c+4,c+8,c+12].every(i => finished.includes(i))) lines++;
    }
    if ([0,5,10,15].every(i => finished.includes(i))) lines++;
    if ([3,6,9,12].every(i => finished.includes(i))) lines++;
    return lines >= 3;
  };

  const handleTaskClick = (index) => {
    const current = taskStates[index];
    if (current === 'default') {
      const newStates = [...taskStates];
      newStates[index] = 'clicking';
      setTaskStates(newStates);
      setTimeout(() => {
        setTaskStates(prev => {
          const updated = [...prev];
          updated[index] = 'finished';
          if (checkForBingo(updated)) {
            setTimeout(() => {
              setShowCelebration(true);
              setCelebrationStage(0);
            }, 300);
          }
          return updated;
        });
      }, 500);
    } else {
      const reset = [...taskStates];
      reset[index] = 'default';
      setTaskStates(reset);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    localStorage.removeItem('bingo_player:' + playerName);
    const newShuffled = shuffleArray(tasks);
