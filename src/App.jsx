import React, { useState, useEffect } from 'react';

const BeerIcon = ({ stage }) => (
  <img 
    src={stage === 'clicking' ? "https://i.imgur.com/pz5ZsvU.png" : "https://i.imgur.com/ewmSdfo.png"} 
    alt="Beer Cheers"
    className="w-full h-full object-contain"
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

// Shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function App() {
  // Get or create shuffled tasks from localStorage
  const [shuffledTasks, setShuffledTasks] = useState(() => {
    // Try to get saved tasks from localStorage
    const savedTasks = localStorage.getItem('barHoppingTasks');
    
    if (savedTasks) {
      // If tasks exist, use them
      return JSON.parse(savedTasks);
    } else {
      // If no tasks exist, shuffle and save
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
      // Fix any stuck "clicking" states on load
      return states.map(state => state === 'clicking' ? 'default' : state);
    }
    return Array(16).fill('default');
  });
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(0);

  // Save task states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('barHoppingStates', JSON.stringify(taskStates));
  }, [taskStates]);

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

  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('barHoppingTasks');
    localStorage.removeItem('barHoppingStates');
    
    // Shuffle tasks again
    const newShuffled = shuffleArray(tasks);
    localStorage.setItem('barHoppingTasks', JSON.stringify(newShuffled));
    setShuffledTasks(newShuffled);
    
    // Reset all task states
    const resetStates = Array(16).fill('default');
    localStorage.setItem('barHoppingStates', JSON.stringify(resetStates));
    setTaskStates(resetStates);
    
    // Close celebration
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

        {/* Reset button at bottom */}
        <button
          onClick={handleReset}
          className="absolute bottom-6 left-6 right-6 z-30 h-8 bg-white text-black border-2 border-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
        >
          重置順序
        </button>
      </div>
    );
  }

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

      {/* Logo - positioned at top with 20px margin on both sides */}
      <div className="absolute top-8 left-5 right-5 z-20">
        <img 
          src="https://i.imgur.com/2TtbhMD.png"
          alt="Logo"
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>

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
