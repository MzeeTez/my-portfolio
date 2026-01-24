import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '@/components/desktop/Window';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRID_SIZE = 20;
const CELL_SIZE = 20; 
const SPEED_INITIAL = 150;
const SPEED_MIN = 80;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeApp = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef<Direction>('RIGHT');
  const speedRef = useRef(SPEED_INITIAL);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateFood = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
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

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || 
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          if (newScore % 50 === 0) speedRef.current = Math.max(SPEED_MIN, speedRef.current - 10);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [food, gameOver, isPaused, gameStarted, highScore, generateFood]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speedRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [moveSnake, gameStarted, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (!gameStarted && e.key === 'Enter') { resetGame(); return; }
      if (e.key === ' ') { setIsPaused(p => !p); return; }

      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  return (
    <Window id="snake" title="Retro Snake" width={500} height={600}>
      <div className="flex flex-col h-full bg-[#0f0f13] text-white p-6 items-center select-none font-mono">
        <div className="w-full flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <div><div className="text-gray-400 text-xs uppercase">Score</div><div className="text-3xl font-bold text-green-400">{score}</div></div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-gray-400 text-xs uppercase justify-end"><Trophy className="w-3 h-3 text-yellow-500" />Best</div>
            <div className="text-xl font-bold text-white">{highScore}</div>
          </div>
        </div>
        <div className="relative bg-black/50 border-2 border-white/10 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }} />
          {!gameStarted && !gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10"><Gamepad2 className="w-12 h-12 text-green-500 mb-2" /><Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">START GAME</Button></div>}
          {gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 animate-in fade-in"><h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2><Button onClick={resetGame} variant="outline" className="border-white/20 text-white gap-2"><RefreshCcw className="w-4 h-4" /> Restart</Button></div>}
          {snake.map((s, i) => <div key={`${s.x}-${s.y}`} className="absolute rounded-sm" style={{ left: s.x * CELL_SIZE, top: s.y * CELL_SIZE, width: CELL_SIZE - 1, height: CELL_SIZE - 1, backgroundColor: i === 0 ? '#4ade80' : '#22c55e' }} />)}
          <div className="absolute rounded-full animate-pulse" style={{ left: food.x * CELL_SIZE, top: food.y * CELL_SIZE, width: CELL_SIZE - 2, height: CELL_SIZE - 2, backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
        </div>
        <div className="mt-6 text-xs text-gray-500">Space to Pause • Arrows to Move</div>
      </div>
    </Window>
  );
};

export default SnakeApp;