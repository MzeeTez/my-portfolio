import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import FinderApp from '@/components/apps/FinderApp';
import TerminalApp from '@/components/apps/TerminalApp';
import SnakeApp from '@/components/apps/SnakeApp';
import TetrisApp from '@/components/apps/TetrisApp';
import wallpaperImg from '@/assets/wallpaper.jpg';
import hackerBgImg from '@/assets/hacker-bg.jpeg';

const Desktop = () => {
  const [isHackerMode, setIsHackerMode] = useState(false);

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(${isHackerMode ? hackerBgImg : wallpaperImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TopBar isHackerMode={isHackerMode} setIsHackerMode={setIsHackerMode} />
      
      <AnimatePresence mode="popLayout">
        <FinderApp key="finder" />
        <TerminalApp key="terminal" />
        {/* New Games */}
        <SnakeApp key="snake" />
        <TetrisApp key="tetris" />
      </AnimatePresence>

      <Dock />
    </div>
  );
};

export default Desktop;