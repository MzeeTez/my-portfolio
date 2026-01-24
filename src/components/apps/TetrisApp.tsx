import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '@/components/desktop/Window';
import { RefreshCcw, Trophy, Gamepad2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Tetris Constants ---
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 25;

const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500 shadow-[0_0_10px_#f97316]' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400 shadow-[0_0_10px_#facc15]' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500 shadow-[0_0_10px_#22c55e]' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500 shadow-[0_0_10px_#a855f7]' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500 shadow-[0_0_10px_#ef4444]' },
};

type ShapeKey = keyof typeof SHAPES;

const TetrisApp = () => {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
  const [currentShape, setCurrentShape] = useState<{ type: ShapeKey; shape: number[][]; x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tetris_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const createPiece = useCallback(() => {
    const shapes = Object.keys(SHAPES) as ShapeKey[];
    const type = shapes[Math.floor(Math.random() * shapes.length)];
    const shape = SHAPES[type].shape;
    return { type, shape, x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };
  }, []);

  const isValidMove = (shape: number[][], x: number, y: number, currentGrid: string[][]) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentGrid[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const mergePiece = (piece: typeof currentShape) => {
    if (!piece) return;
    const newGrid = [...grid.map(row => [...row])];
    
    piece.shape.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
           // Prevent crash if piece is above board
           if (piece.y + r >= 0) newGrid[piece.y + r][piece.x + c] = SHAPES[piece.type].color;
        }
      });
    });

    // Check for cleared lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newGrid[r].every(cell => cell !== '')) {
        newGrid.splice(r, 1);
        newGrid.unshift(Array(COLS).fill(''));
        linesCleared++;
        r++; // Check same row again
      }
    }

    if (linesCleared > 0) {
       setScore(s => {
          const newScore = s + (linesCleared * 100 * linesCleared); // Bonus for multi-line
          if (newScore > highScore) {
             setHighScore(newScore);
             localStorage.setItem('tetris_highscore', newScore.toString());
          }
          return newScore;
       });
    }

    setGrid(newGrid);
    const newPiece = createPiece();
    if (!isValidMove(newPiece.shape, newPiece.x, newPiece.y, newGrid)) {
      setGameOver(true);
      setGameStarted(false);
    } else {
      setCurrentShape(newPiece);
    }
  };

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentShape || gameOver || !gameStarted) return;
    if (isValidMove(currentShape.shape, currentShape.x + dx, currentShape.y + dy, grid)) {
      setCurrentShape({ ...currentShape, x: currentShape.x + dx, y: currentShape.y + dy });
    } else if (dy > 0) {
      // Hit bottom or another piece
      mergePiece(currentShape);
    }
  }, [currentShape, grid, gameOver, gameStarted, createPiece]);

  const rotatePiece = () => {
    if (!currentShape || gameOver || !gameStarted) return;
    const rotated = currentShape.shape[0].map((_, index) => currentShape.shape.map(row => row[index]).reverse());
    if (isValidMove(rotated, currentShape.x, currentShape.y, grid)) {
      setCurrentShape({ ...currentShape, shape: rotated });
    }
  };

  // Game Loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => movePiece(0, 1), 500); // Speed
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [gameStarted, gameOver, movePiece]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      
      switch (e.key) {
        case 'ArrowLeft': movePiece(-1, 0); break;
        case 'ArrowRight': movePiece(1, 0); break;
        case 'ArrowDown': movePiece(0, 1); break;
        case 'ArrowUp': rotatePiece(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, movePiece, rotatePiece]);

  const startGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setCurrentShape(createPiece());
  };

  return (
    <Window id="tetris" title="Cyber Tetris" width={450} height={700}>
      <div className="flex flex-col h-full bg-[#11111b] text-white p-6 items-center select-none font-mono">
        {/* Header */}
        <div className="w-full flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <div><div className="text-gray-400 text-xs uppercase tracking-widest">Score</div><div className="text-3xl font-bold text-cyan-400">{score}</div></div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-gray-400 text-xs uppercase justify-end"><Trophy className="w-3 h-3 text-yellow-500" />Best</div>
            <div className="text-xl font-bold text-white">{highScore}</div>
          </div>
        </div>

        {/* Board */}
        <div className="relative border-2 border-white/10 bg-black/60 rounded-lg overflow-hidden shadow-2xl">
          <div 
             className="grid"
             style={{ 
               gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`, 
               gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)` 
             }}
          >
            {/* Render Grid & Current Piece */}
            {grid.map((row, r) => row.map((color, c) => {
               // Determine color: either from grid (landed) or current moving piece
               let cellColor = color;
               if (currentShape && 
                   r >= currentShape.y && r < currentShape.y + currentShape.shape.length &&
                   c >= currentShape.x && c < currentShape.x + currentShape.shape[0].length &&
                   currentShape.shape[r - currentShape.y][c - currentShape.x]) {
                  cellColor = SHAPES[currentShape.type].color;
               }

               return (
                 <div 
                   key={`${r}-${c}`} 
                   className={`border border-white/5 ${cellColor}`}
                 />
               );
            }))}
          </div>

          {/* Overlays */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
              <Gamepad2 className="w-12 h-12 text-cyan-500 mb-4 animate-bounce" />
              <Button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8">START GAME</Button>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 animate-in fade-in">
              <h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2>
              <div className="text-gray-400 mb-6">Final Score: {score}</div>
              <Button onClick={startGame} variant="outline" className="border-white/20 text-white"><RefreshCcw className="w-4 h-4 mr-2" /> Try Again</Button>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-xs text-gray-500">Up to Rotate • Arrows to Move</div>
      </div>
    </Window>
  );
};

export default TetrisApp;