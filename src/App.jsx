import React, { useState, useEffect } from 'react';

const BeerIcon = ({ stage }) => (
  <img 
    src={stage === 'clicking' ? "https://i.imgur.com/pz5ZsvU.png" : "https://i.imgur.com/ewmSdfo.png"} 
    alt="Beer Cheers"
    className="w-12 h-12 object-contain"
  />
);

const tasks = [
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

export default function App() {
  // Shuffle tasks on component mount
  const [shuffledTasks] = useState(() => {
    const shuffled = [...tasks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  
  const [taskStates, setTaskStates] = useState(Array(16).fill('default'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);

  const checkForBingo = (states) => {
    const finishedIndices = states.map((state, idx) => state === 'finished' ? idx : -1).filter(idx => idx !== -1);
    
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
      
      // After 200ms, change to finished with icon 2
      setTimeout(() => {
        const updatedStates = [...taskStates];
        updatedStates[index] = 'finished';
        setTaskStates(updatedStates);
        
        // Check for bingo
        if (checkForBingo(updatedStates)) {
          setTimeout(() => {
            setShowCelebration(true);
            setCelebrationStage(0);
          }, 300);
        }
      }, 200);
    } else if (currentState === 'finished') {
      // Reset to default
      const newStates = [...taskStates];
      newStates[index] = 'default';
      setTaskStates(newStates);
    }
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

  if (showCelebration) {
    return (
      <div className="w-full h-screen bg-blue-900 relative overflow-hidden flex items-center justify-center">
        {/* Background image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
        
        {/* Logo at top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-80">
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
          className="absolute top-4 right-4 z-30 bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          關閉
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-blue-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900"></div>
      </div>

      {/* Top image/logo area */}
      <div className="relative z-10 w-full h-60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-50"></div>
        <img 
          src="https://i.imgur.com/W0XrIS3.png"
          alt="Party Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md mx-auto px-3 pb-8">
        <div className="bg-white/95 rounded-2xl p-6 shadow-2xl">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src="https://i.imgur.com/2TtbhMD.png"
              alt="Logo"
              className="w-full h-auto"
            />
          </div>

          {/* 4x4 Grid */}
          <div className="grid grid-cols-4 gap-2">
            {shuffledTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => handleTaskClick(index)}
                className={`
                  aspect-square p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center
                  ${taskStates[index] === 'default' ? 'bg-white border-2 border-black hover:bg-gray-50' : ''}
                  ${taskStates[index] === 'clicking' ? 'bg-yellow-100 border-2 border-yellow-500 scale-95' : ''}
                  ${taskStates[index] === 'finished' ? 'bg-white border-2 border-green-600' : ''}
                `}
              >
                {taskStates[index] === 'default' && (
                  <div className="text-[10px] leading-tight text-center text-black">
                    {task}
                  </div>
                )}
                
                {taskStates[index] === 'clicking' && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <BeerIcon stage="clicking" />
                  </div>
                )}
                
                {taskStates[index] === 'finished' && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <BeerIcon stage="finished" />
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white"></div>
                      </div>
                      <span className="text-[10px] font-bold text-green-600">Finish!</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
