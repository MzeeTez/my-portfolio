import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '@/components/desktop/Window';
import { Trophy, RefreshCcw, Play, Pause, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Game Constants ---
const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const SPEED_INITIAL = 150;
const SPEED_MIN = 80; // Cap speed

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GameApp = () => {
  // Game State
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Refs for mutable state in interval
  const directionRef = useRef<Direction>('RIGHT');
  const speedRef = useRef(SPEED_INITIAL);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // --- Game Logic ---
  const generateFood = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
    speedRef.current = SPEED_INITIAL;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // 1. Check Collision with Walls
      if (
        head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // 2. Check Collision with Self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // 3. Check Food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          // Increase speed every 50 points
          if (newScore % 50 === 0) {
            speedRef.current = Math.max(SPEED_MIN, speedRef.current - 10);
          }
          return newScore;
        });
        setFood(generateFood());
        // Don't pop tail (grow)
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, gameStarted, highScore, generateFood]);

  // --- Game Loop ---
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speedRef.current);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameStarted, gameOver, isPaused]);

  // --- Controls ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!gameStarted && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  return (
    <Window id="vscode" title="Retro Snake" width={600} height={700}>
      <div className="flex flex-col h-full bg-[#0f0f13] text-white p-6 items-center select-none font-mono">
        
        {/* Header / Stats */}
        <div className="w-full max-w-md flex justify-between items-end mb-6 border-b border-white/10 pb-4">
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Current Score</div>
            <div className="text-4xl font-bold text-green-400 font-mono">
              {score.toString().padStart(3, '0')}
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-1 justify-end">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span>Best</span>
             </div>
            <div className="text-2xl font-bold text-white font-mono">
              {highScore.toString().padStart(3, '0')}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="relative bg-black/50 border-2 border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE,
            boxShadow: gameOver ? '0 0 50px rgba(239, 68, 68, 0.2)' : '0 0 50px rgba(74, 222, 128, 0.1)'
          }}
        >
          {/* Grid Background (Optional styling) */}
          <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }} 
          />

          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 space-y-4">
              <Gamepad2 className="w-16 h-16 text-green-500 mb-2 animate-bounce" />
              <h2 className="text-2xl font-bold">Ready to Play?</h2>
              <p className="text-gray-400 text-sm">Use Arrow Keys to Move</p>
              <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
                 START GAME
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 animate-in fade-in duration-300">
              <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
              <p className="text-gray-300 mb-6">Score: {score}</p>
              <Button onClick={resetGame} variant="outline" className="border-white/20 hover:bg-white/10 text-white gap-2">
                 <RefreshCcw className="w-4 h-4" /> Try Again
              </Button>
            </div>
          )}

          {isPaused && !gameOver && gameStarted && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-[2px]">
                <div className="bg-black/80 px-6 py-3 rounded-lg border border-white/10 text-xl font-bold tracking-widest">PAUSED</div>
             </div>
          )}

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={`${segment.x}-${segment.y}`}
              className="absolute rounded-sm transition-all duration-100"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: i === 0 ? '#4ade80' : '#22c55e', // Head is lighter green
                zIndex: 2,
                boxShadow: i === 0 ? '0 0 10px #4ade80' : 'none'
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              backgroundColor: '#ef4444',
              zIndex: 1,
              boxShadow: '0 0 15px #ef4444'
            }}
          />
        </div>

        {/* Controls Hint */}
        <div className="mt-6 flex gap-4 text-xs text-gray-500 font-medium">
           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
              <span className="text-gray-300">Space</span> Pause
           </div>
           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
              <span className="text-gray-300">Arrows</span> Move
           </div>
        </div>

      </div>
    </Window>
  );
};

export default GameApp;