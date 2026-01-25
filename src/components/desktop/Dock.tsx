import { useRef, useState } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence 
} from 'framer-motion';
import { 
  Folder, Terminal, Globe, Trash2, 
  Github, Linkedin, FileText, 
  Gamepad2, Grid3X3, ContactRound,
  Zap, ZapOff 
} from 'lucide-react';
import { useWindows, AppId } from '@/contexts/WindowContext';

interface DockItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  isLink?: boolean;
  url?: string;
  onClick?: () => void;
}

const dockApps: DockItem[] = [
  // --- Apps (Internal Windows) ---
  { id: 'finder', icon: Folder, label: 'Files', color: 'bg-blue-500/90' },
  { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-gray-800/90' },
  
  // --- Arcade Games ---
  { id: 'snake', icon: Gamepad2, label: 'Snake', color: 'bg-green-600/90' },
  { id: 'tetris', icon: Grid3X3, label: 'Tetris', color: 'bg-cyan-600/90' },

  // --- Browser ---
  { id: 'safari', icon: Globe, label: 'Browser', color: 'bg-indigo-500/90' },

  // --- NEW: Contact App ---
  { id: 'contact', icon: ContactRound, label: 'Contact', color: 'bg-pink-600/90' },

  // --- External Links ---
  { 
    id: 'github', 
    icon: Github, 
    label: 'GitHub', 
    color: 'bg-gray-900/90', 
    isLink: true, 
    url: 'https://github.com/MzeeTez' 
  },
  { 
    id: 'linkedin', 
    icon: Linkedin, 
    label: 'LinkedIn', 
    color: 'bg-blue-700/90', 
    isLink: true, 
    url: 'https://www.linkedin.com/in/aditya-kumar-singh-20061728b/' 
  },
  { 
    id: 'resume', 
    icon: FileText, 
    label: 'Resume', 
    color: 'bg-emerald-600/90', 
    isLink: true, 
    url: '/resume.pdf' 
  },
];

interface DockProps {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const Dock = ({ isDevMode, toggleDevMode }: DockProps) => {
  const { windows, openApp, minimizeApp, closeApp } = useWindows();
  const mouseX = useMotionValue(Infinity);
  const [isHovered, setIsHovered] = useState(false);

  // Check if any window is currently maximized
  const isAnyMaximized = Object.values(windows).some(w => w.isMaximized);

  // Logic: 
  // 1. If NO app is maximized -> Always visible (showDock = true)
  // 2. If app IS maximized -> Only visible on hover
  const showDock = !isAnyMaximized || isHovered;

  const handleDockClick = (item: DockItem) => {
    // Handle Custom Action (e.g., Dev Mode Toggle)
    if (item.onClick) {
      item.onClick();
      return;
    }

    // Handle External Links
    if (item.isLink && item.url) {
      window.open(item.url, '_blank');
      return;
    }

    // Handle Internal Apps
    const appId = item.id as AppId;
    if (windows[appId]?.isOpen && !windows[appId]?.isMinimized) {
      minimizeApp(appId);
    } else {
      openApp(appId);
    }
  };

  const closeAllApps = () => {
     Object.keys(windows).forEach((key) => {
        closeApp(key as AppId);
     });
  };

  // --- Dev Mode Item Configuration ---
  const devModeItem: DockItem = {
    id: 'devmode',
    // Switched to Zap (Lightning) for a cooler look
    icon: isDevMode ? Zap : ZapOff,
    label: isDevMode ? 'Dev Mode: ON' : 'Dev Mode: OFF',
    // Amber color for "Energy/Power" look when active
    color: isDevMode ? 'bg-amber-500/90' : 'bg-slate-700/90',
    onClick: toggleDevMode
  };

  return (
    // Trigger Area: Sits at bottom, detects hover
    <div 
      className="fixed bottom-0 left-0 right-0 h-20 z-[9999] flex items-end justify-center group pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        // Animate visibility based on state
        animate={{ y: showDock ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-max flex flex-col items-center gap-2 pb-2 pointer-events-auto"
      >
        {/* Dock Container */}
        <div className="flex items-end h-16 gap-3 px-4 pb-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          {dockApps.map((app) => (
            <DockIcon
              key={app.id}
              mouseX={mouseX}
              item={app}
              isOpen={!app.isLink && !app.onClick && windows[app.id as AppId]?.isOpen}
              onClick={() => handleDockClick(app)}
            />
          ))}
          
          {/* Separator (Kept between apps and system tools) */}
          <div className="w-px h-10 bg-white/10 mx-1 self-center mb-1" />
          
          {/* Trash */}
          <DockIcon
            mouseX={mouseX}
            item={{
              id: 'trash',
              icon: Trash2,
              label: 'Trash',
              color: 'bg-red-500/80'
            }}
            isOpen={false}
            onClick={closeAllApps}
          />

          {/* Dev Mode Button (No separator before it) */}
          <DockIcon 
             mouseX={mouseX}
             item={devModeItem}
             isOpen={isDevMode} // Shows dot when ON
             onClick={() => handleDockClick(devModeItem)}
          />

        </div>
      </motion.div>
    </div>
  );
};

interface DockIconProps {
  mouseX: any;
  item: DockItem;
  isOpen: boolean;
  onClick: () => void;
}

const DockIcon = ({ mouseX, item, isOpen, onClick }: DockIconProps) => {
  const Icon = item.icon;
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  // --- Magnification Math ---
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 90, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const handleClick = () => {
    onClick();
    if (!item.isLink) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-end group/icon">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -15, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute -top-12 px-3 py-1.5 bg-gray-900/90 backdrop-blur border border-white/10 rounded-lg text-xs font-medium text-white shadow-xl whitespace-nowrap pointer-events-none z-50"
          >
            {item.label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bounce Animation Wrapper */}
      <motion.div
         animate={isBouncing ? { y: [0, -20, 0] } : { y: 0 }}
         transition={isBouncing ? { repeat: 1, duration: 0.5, ease: "easeInOut" } : {}}
      >
        <motion.button
          ref={ref}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width, height: width }}
          className="relative flex items-center justify-center rounded-2xl focus:outline-none"
        >
          {/* Icon Background */}
          <div
            className={`w-full h-full ${item.color} rounded-2xl flex items-center justify-center shadow-lg border border-white/10 transition-all overflow-hidden`}
          >
             {/* Shine Effect */}
             {item.isLink && (
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             )}
             
             {/* Icon */}
             <motion.div style={{ width: useTransform(width, [48, 90], [24, 45]) }}>
                <Icon className="w-full h-full text-white" />
             </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Active Dot Indicator */}
      <div className="absolute -bottom-2">
        {isOpen && (
          <motion.div
            layoutId={`dot-${item.id}`}
            className="w-1 h-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        )}
      </div>
    </div>
  );
};

export default Dock;