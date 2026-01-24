import { useState, useEffect, useRef } from 'react';
import { 
  Wifi, Volume2, VolumeX, Bluetooth, Lock, 
  FileText, Grid, Terminal as TerminalIcon, FolderOpen, Mail,
  CloudSun, Music, Play, Pause, Bell,
  Github, ExternalLink, BatteryFull, Code, Linkedin, LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { useWindows, AppId } from '@/contexts/WindowContext';

// UI Components
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopBarProps {
  isHackerMode: boolean;
  setIsHackerMode: (value: boolean) => void;
}

const TopBar = ({ isHackerMode, setIsHackerMode }: TopBarProps) => {
  const { windows, openApp, closeApp } = useWindows();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [volume, setVolume] = useState([75]);
  const [brightness, setBrightness] = useState([100]);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- EFFECT: Handle Volume Changes ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // --- EFFECT: Handle Brightness ---
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.filter = `brightness(${brightness[0]}%)`;
    }
  }, [brightness]);

  // --- EFFECT: Handle Hacker Mode Theme Injection ---
  useEffect(() => {
    if (isHackerMode) {
      document.documentElement.classList.add('hacker-theme');
      
      // Inject Hacker Styles
      const style = document.createElement('style');
      style.id = 'hacker-style';
      style.innerHTML = `
        .hacker-theme * {
          font-family: 'Courier New', Courier, monospace !important;
        }
        
        /* Hacker Theme Colors */
        .hacker-theme div, 
        .hacker-theme button, 
        .hacker-theme span, 
        .hacker-theme p, 
        .hacker-theme h1, 
        .hacker-theme h2, 
        .hacker-theme h3, 
        .hacker-theme h4 {
          color: #00ff00 !important;
          text-shadow: 0 0 5px #00ff00;
        }
        
        /* Background overrides */
        .hacker-theme div[class*="bg-"], 
        .hacker-theme button[class*="bg-"] {
          background-color: rgba(0, 0, 0, 0.9) !important;
        }
        
        /* Glass and panels */
        .hacker-theme .glass, 
        .hacker-theme .bg-black\\/90,
        .hacker-theme [class*="bg-[#"] {
          background: rgba(0, 0, 0, 0.85) !important;
          border: 1px solid #00ff00 !important;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
        }
        
        /* Borders */
        .hacker-theme * {
          border-color: #00ff00 !important;
          border-radius: 0 !important;
        }
        
        /* Sliders */
        .hacker-theme input[type="range"]::-webkit-slider-thumb {
          background: #00ff00 !important;
          box-shadow: 0 0 10px #00ff00 !important;
        }
        .hacker-theme input[type="range"]::-moz-range-thumb {
          background: #00ff00 !important;
          box-shadow: 0 0 10px #00ff00 !important;
        }
        .hacker-theme input[type="range"]::-webkit-slider-track {
          background: rgba(0, 255, 0, 0.2) !important;
        }
        
        /* Icons */
        .hacker-theme svg {
          color: #00ff00 !important;
          filter: drop-shadow(0 0 3px #00ff00);
        }
        
        /* Hover effects */
        .hacker-theme button:hover,
        .hacker-theme [role="menuitem"]:hover {
          background-color: rgba(0, 255, 0, 0.2) !important;
        }
        
        /* Active/Selected states */
        .hacker-theme [data-state="open"],
        .hacker-theme [aria-selected="true"] {
          background-color: rgba(0, 255, 0, 0.3) !important;
        }
        
        /* Dock Icons */
        .hacker-theme .dock-icon {
          background: rgba(0, 0, 0, 0.9) !important;
          border: 2px solid #00ff00 !important;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.5) !important;
        }
        
        .hacker-theme .dock-icon:hover {
          background: rgba(0, 255, 0, 0.2) !important;
          transform: translateY(-8px) scale(1.1) !important;
          box-shadow: 0 0 25px rgba(0, 255, 0, 0.8) !important;
        }
        
        /* Dock Container */
        .hacker-theme .dock-container {
          background: rgba(0, 0, 0, 0.95) !important;
          border: 2px solid #00ff00 !important;
          box-shadow: 0 -5px 30px rgba(0, 255, 0, 0.4) !important;
        }
        
        /* Scanline effect */
        .hacker-theme body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 0, 0.03) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 3px
          );
          pointer-events: none;
          z-index: 9999;
        }
        
        /* Ensure text is readable on black */
        .hacker-theme body {
          background-color: #000000 !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove('hacker-theme');
      const style = document.getElementById('hacker-style');
      if (style) style.remove();
    }
  }, [isHackerMode]);

  // --- Initialize Audio ---
  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = volume[0] / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle Volume Mute Toggle
  const toggleMute = () => {
    if (volume[0] > 0) {
      setVolume([0]);
    } else {
      setVolume([75]);
    }
  };

  // Clock Timer
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAllApps = () => {
    const appIds = Object.keys(windows) as AppId[];
    const allOpen = appIds.every((id) => windows[id].isOpen);

    if (allOpen) {
      appIds.forEach((id) => closeApp(id));
    } else {
      appIds.forEach((id) => openApp(id));
    }
  };

  const openResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-black/90 backdrop-blur-md z-50 grid grid-cols-3 items-center px-4 text-sm select-none text-white border-b border-white/10 shadow-sm font-sans transition-all duration-300">
      
      {/* --- LEFT: Activities --- */}
      <div className="flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-1.5 rounded-full hover:bg-white/15 transition-all duration-200 font-medium text-sm tracking-wide outline-none focus:ring-2 focus:ring-white/20 active:scale-95">
              Activities
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 mt-2 bg-[#1e1e1e]/95 backdrop-blur-xl border-white/10 text-gray-200 shadow-2xl animate-in slide-in-from-top-2 p-2">
            <DropdownMenuItem onClick={openResume} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3 px-3 rounded-lg transition-colors text-base">
              <FileText className="mr-3 h-5 w-5" />
              <span className="font-medium">Resume</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={toggleAllApps} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3 px-3 rounded-lg transition-colors text-base">
              <Grid className="mr-3 h-5 w-5" />
              <span className="font-medium">Show Applications</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10 my-2" />
            
            <DropdownMenuItem onClick={() => openApp('terminal')} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3 px-3 rounded-lg transition-colors text-base">
              <TerminalIcon className="mr-3 h-5 w-5" />
              <span className="font-medium">Terminal</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => openApp('finder')} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3 px-3 rounded-lg transition-colors text-base">
              <FolderOpen className="mr-3 h-5 w-5" />
              <span className="font-medium">Files</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => openApp('mail')} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3 px-3 rounded-lg transition-colors text-base">
              <Mail className="mr-3 h-5 w-5" />
              <span className="font-medium">Send Mail</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- CENTER: Date & Time --- */}
      <div className="flex items-center justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-6 py-1.5 rounded-full hover:bg-white/15 transition-all duration-200 font-medium flex gap-3 outline-none focus:ring-2 focus:ring-white/20 active:scale-95 group text-sm">
              <span className="group-hover:text-blue-300 transition-colors">{format(currentTime, 'MMM d')}</span>
              <span className="text-white/30">|</span>
              <span className="group-hover:text-blue-300 transition-colors">{format(currentTime, 'h:mm a')}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[850px] p-0 mt-3 bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 text-gray-200 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200" align="center">
            <div className="flex h-[520px]">
              
              {/* Left Side: Widgets & Notifications */}
              <div className="flex-1 p-6 bg-gradient-to-br from-white/5 to-transparent flex flex-col gap-6 border-r border-white/5 overflow-hidden">
                
                {/* Clock Header */}
                <div className="space-y-1">
                  <h3 className="text-4xl font-light text-white tracking-tight">
                    {format(currentTime, 'h:mm')} <span className="text-xl text-muted-foreground">{format(currentTime, 'a')}</span>
                  </h3>
                  <p className="text-blue-400 font-medium text-base uppercase tracking-wider">
                    {format(currentTime, 'EEEE, MMMM do')}
                  </p>
                </div>

                {/* Weather */}
                <div className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="bg-yellow-500/20 p-3 rounded-full">
                    <CloudSun className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">24°C</div>
                    <div className="text-sm text-muted-foreground">Partly Cloudy • Kolkata</div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                   <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-sm text-white">Notifications</span>
                      </div>
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">1 New</span>
                   </div>
                   
                   <ScrollArea className="flex-1 p-0">
                      <div className="p-2 space-y-2">
                         <div className="group relative bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex gap-3">
                               <div className="mt-1">
                                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-white/10">
                                     <Github className="w-4 h-4 text-white" />
                                  </div>
                               </div>
                               <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-start">
                                     <h4 className="text-sm font-semibold text-white">GitHub Activity</h4>
                                     <span className="text-[10px] text-muted-foreground">Just now</span>
                                  </div>
                                  <p className="text-sm text-gray-300 leading-snug">
                                     Aditya is working on <a href="https://github.com/MzeeTez" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">MzeeTez <ExternalLink className="w-3 h-3" /></a>
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </ScrollArea>
                </div>

              </div>

              {/* Right Side: Calendar & Music */}
              <div className="w-[400px] p-6 flex flex-col gap-4 bg-[#18181b]">
                
                {/* Calendar */}
                <div className="bg-white/5 rounded-2xl border border-white/5 p-3 flex-1 flex flex-col justify-center">
                   <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                    classNames={{
                      month: "space-y-4 text-white w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-lg font-medium text-white",
                      nav_button: "h-8 w-8 hover:bg-white/10 rounded-lg text-white transition-colors",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex justify-between",
                      head_cell: "text-muted-foreground font-medium text-sm w-10",
                      row: "flex w-full mt-2 justify-between",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-normal hover:bg-white/10 rounded-lg transition-colors text-gray-300 aria-selected:opacity-100",
                      day_today: "bg-white/10 text-blue-400 font-extrabold border-2 border-blue-500/40",
                      day_selected: "!bg-blue-600 !text-white hover:bg-blue-600 shadow-md shadow-blue-900/50",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                  />
                </div>

                {/* Music Player */}
                <div className="h-[90px] mt-auto shrink-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-4 rounded-2xl border border-white/10 relative overflow-hidden group">
                  {isPlaying && (
                     <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-20 pointer-events-none pb-2">
                        {[...Array(15)].map((_, i) => (
                           <div key={i} className="w-1.5 bg-white animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDuration: '0.6s' }} />
                        ))}
                     </div>
                  )}

                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'} ${isPlaying ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                      <Music className={`w-7 h-7 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-white truncate">Lofi Study Beats</div>
                      <div className="text-xs text-blue-200 truncate">Relaxing Vibes</div>
                      <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                        <div className={`h-full bg-blue-400 rounded-full transition-all duration-1000 ${isPlaying ? 'w-full animate-[progress_30s_linear_infinite]' : 'w-1/3'}`} />
                      </div>
                    </div>
                    <Button onClick={togglePlay} size="icon" className={`h-12 w-12 shrink-0 rounded-full shadow-xl transition-all ${isPlaying ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* --- RIGHT: System Tray --- */}
      <div className="flex items-center justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-4 px-5 py-1.5 rounded-full hover:bg-white/15 transition-all duration-200 outline-none focus:ring-2 focus:ring-white/20 active:scale-95">
              <Wifi className="w-5 h-5" />
              {volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <BatteryFull className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 mr-4 mt-3 p-5 bg-[#1e1e1e]/95 backdrop-blur-2xl border border-white/10 text-gray-200 shadow-2xl rounded-3xl animate-in slide-in-from-top-2" align="end">
            <div className="space-y-6">
              
              {/* Quick Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsWifiOn(!isWifiOn)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${isWifiOn ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 hover:bg-white/10 border-white/5'}`}>
                  <Wifi className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-base font-semibold">Wi-Fi</div>
                    <div className="text-xs opacity-80">{isWifiOn ? 'My_Network' : 'Off'}</div>
                  </div>
                </button>

                <button onClick={() => setIsBluetoothOn(!isBluetoothOn)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${isBluetoothOn ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 hover:bg-white/10 border-white/5'}`}>
                  <Bluetooth className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-base font-semibold">Bluetooth</div>
                    <div className="text-xs opacity-80">{isBluetoothOn ? 'Connected' : 'Off'}</div>
                  </div>
                </button>
              </div>

               {/* Battery Status */}
               <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                  <BatteryFull className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Battery</div>
                    <div className="text-xs text-green-400">100% • Fully Charged</div>
                  </div>
               </div>

              {/* Sliders */}
              <div className="space-y-6 px-1">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <span>Sound</span>
                    <span>{volume[0]}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={toggleMute} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                      {volume[0] === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-400" />}
                    </button>
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1 cursor-pointer py-1" />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <span>Brightness</span>
                    <span>{brightness[0]}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CloudSun className="w-5 h-5 text-gray-400" />
                    <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} className="flex-1 cursor-pointer py-1" />
                  </div>
                </div>
              </div>

              {/* Footer Actions (Links & Power) */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {/* Hacker/Dev Mode Toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsHackerMode(!isHackerMode)}
                  className={`h-10 w-10 rounded-full transition-all duration-300 ${isHackerMode ? 'text-green-500 bg-green-500/20 shadow-lg shadow-green-500/20' : 'hover:bg-white/10'}`}
                  title={isHackerMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
                >
                  <Code className="w-5 h-5" />
                </Button>

                {/* Social Links Row */}
                <div className="flex gap-2">
                   <Button variant="ghost" size="icon" onClick={() => window.open('https://github.com/MzeeTez', '_blank')} className="h-10 w-10 rounded-full hover:bg-white/10 transition-colors">
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.open('https://www.linkedin.com/in/aditya-kumar-singh-20061728b/', '_blank')} className="h-10 w-10 rounded-full hover:bg-blue-600/10 hover:text-blue-400 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={openResume} className="h-10 w-10 rounded-full hover:bg-white/10 transition-colors">
                    <FileText className="w-5 h-5" />
                  </Button>
                  <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                  {/* Exit/Power Button */}
                  <Button variant="ghost" size="icon" onClick={handleExit} className="h-10 w-10 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors text-red-500">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};

export default TopBar;