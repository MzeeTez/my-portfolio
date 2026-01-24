import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import FinderApp from '@/components/apps/FinderApp';
import TerminalApp from '@/components/apps/TerminalApp';
import SafariApp from '@/components/apps/SafariApp';
import MailApp from '@/components/apps/MailApp';
import SnakeApp from '@/components/apps/SnakeApp';
import TetrisApp from '@/components/apps/TetrisApp';
// 1. IMPORT ContactApp
import ContactApp from '@/components/apps/ContactApp';
import wallpaperImg from '@/assets/wallpaper.jpg';
import hackerBgImg from '@/assets/hacker-bg.jpeg';

const Desktop = () => {
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [isWifiOn, setIsWifiOn] = useState(true);

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(${isHackerMode ? hackerBgImg : wallpaperImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TopBar 
        isHackerMode={isHackerMode} 
        setIsHackerMode={setIsHackerMode} 
        isWifiOn={isWifiOn}
        setIsWifiOn={setIsWifiOn}
      />
      
      <AnimatePresence mode="popLayout">
        <FinderApp key="finder" />
        <TerminalApp key="terminal" />
        <SafariApp key="safari" isWifiOn={isWifiOn} />
        <MailApp key="mail" />
        {/* New Games */}
        <SnakeApp key="snake" />
        <TetrisApp key="tetris" />
        {/* 2. RENDER ContactApp */}
        <ContactApp key="contact" />
      </AnimatePresence>

      <Dock />
    </div>
  );
};

export default Desktop;