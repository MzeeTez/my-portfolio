import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import FinderApp from '@/components/apps/FinderApp';
import TerminalApp from '@/components/apps/TerminalApp';
import SafariApp from '@/components/apps/SafariApp';
import MailApp from '@/components/apps/MailApp';
import SnakeApp from '@/components/apps/SnakeApp';
import TetrisApp from '@/components/apps/TetrisApp';
import ContactApp from '@/components/apps/ContactApp';
import wallpaperImg from '@/assets/wallpaper.jpg';
import hackerBgImg from '@/assets/hacker-bg.jpeg';
import { Terminal, Cpu, Globe, Wifi } from 'lucide-react';

// --- Typewriter Widget Component ---
const TypewriterWidget = () => {
  const [text, setText] = useState('');
  
  // Resume data configuration
  const fullText = `> CONNECTING TO SERVER...
> IDENTITY VERIFIED: ADITYA KUMAR SINGH
> ROLE: ANDROID DEVELOPER
> LOCATION: KOLKATA, INDIA
> 
> /// SKILL_MATRIX_LOADED ///
> [LANGUAGES] : JAVA, PYTHON, DART, XML, C
> [FRAMEWORKS]: FLUTTER, ANDROID SDK, FIREBASE
> [TOOLS]     : GIT, ANDROID STUDIO, BLENDER
> 
> /// MISSION_LOG ///
> "Motivated developer building full-stack
>  mobile apps with real-time IoT & Maps.
>  Creator of Auctora, EVX, & IEM-Ride."
> 
> [CONTACT]: adityaaa232004@gmail.com
> [STATUS] : ONLINE & READY`;

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(intervalId);
      }
    }, 25); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    // Left-aligned widget
    <div className="absolute top-24 left-12 z-0 select-none pointer-events-none hidden md:block animate-in fade-in slide-in-from-left-10 duration-1000">
      
      {/* Glassmorphism Card with Glowing Border */}
      <div className="w-[500px] bg-black/40 backdrop-blur-md border border-green-500/20 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,255,100,0.05)]">
        
        {/* Fake Terminal Header */}
        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-green-500/80" />
                <span className="text-[10px] font-mono text-green-500/60 tracking-widest">USER_PROFILE.EXE</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
        </div>

        {/* Content Area */}
        <div className="p-6 relative">
            {/* Background Decorative Icons */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-10">
                <Cpu className="w-12 h-12 text-green-400" />
                <Globe className="w-8 h-8 text-green-400" />
                <Wifi className="w-8 h-8 text-green-400" />
            </div>

            {/* Typing Text */}
            <div className="font-mono text-[15px] text-green-400/90 leading-relaxed whitespace-pre-wrap font-medium shadow-black drop-shadow-sm">
            {text}
            <span className="animate-pulse inline-block w-2.5 h-5 bg-green-500 ml-1 align-bottom shadow-[0_0_8px_rgba(0,255,0,0.8)]"></span>
            </div>
        </div>
        
        {/* Footer Status Bar */}
        <div className="h-6 bg-green-500/5 border-t border-green-500/10 flex items-center justify-between px-4 text-[10px] text-green-500/40 font-mono">
            <span>CPU: 24%</span>
            <span>MEM: 512MB</span>
            <span>NET: CONNECTED</span>
        </div>
      </div>
    </div>
  );
};

const Desktop = () => {
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [isWifiOn, setIsWifiOn] = useState(true);

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none transition-all duration-700 ease-in-out relative"
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

      {/* Persistent Profile Widget */}
      <TypewriterWidget />
      
      <AnimatePresence mode="popLayout">
        <FinderApp key="finder" />
        <TerminalApp key="terminal" />
        <SafariApp key="safari" isWifiOn={isWifiOn} />
        <MailApp key="mail" />
        <SnakeApp key="snake" />
        <TetrisApp key="tetris" />
        <ContactApp key="contact" />
      </AnimatePresence>

      <Dock />
    </div>
  );
};

export default Desktop;