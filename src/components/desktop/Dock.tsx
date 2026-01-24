import { motion } from 'framer-motion';
import { 
  Folder, Terminal, Globe, Code2, Trash2, 
  Github, Linkedin, FileText, 
  Gamepad2, Grid3X3 
} from 'lucide-react';
import { useWindows, AppId } from '@/contexts/WindowContext';

interface DockItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  isLink?: boolean;
  url?: string;
}

const dockApps: DockItem[] = [
  // --- Apps (Internal Windows) ---
  { id: 'finder', icon: Folder, label: 'Files', color: 'bg-blue-500/90' },
  { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-gray-800/90' },
  
  // --- Arcade Games (New) ---
  { id: 'snake', icon: Gamepad2, label: 'Snake', color: 'bg-green-600/90' },
  { id: 'tetris', icon: Grid3X3, label: 'Tetris', color: 'bg-cyan-600/90' },

  // --- Dev Tools ---
  { id: 'vscode', icon: Code2, label: 'Code', color: 'bg-sky-700/90' },
  { id: 'safari', icon: Globe, label: 'Browser', color: 'bg-indigo-500/90' },

  // --- External Links (Portfolio Essentials) ---
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

const Dock = () => {
  const { windows, openApp, minimizeApp } = useWindows();

  const handleDockClick = (item: DockItem) => {
    // Handle External Links
    if (item.isLink && item.url) {
      window.open(item.url, '_blank');
      return;
    }

    // Handle Internal Apps
    // We cast to AppId because we know these IDs exist in WindowContext
    const appId = item.id as AppId;
    if (windows[appId]?.isOpen && !windows[appId]?.isMinimized) {
      minimizeApp(appId);
    } else {
      openApp(appId);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      // Position: Centered horizontally, floated 8 units from bottom
      className="fixed bottom-8 left-0 right-0 mx-auto w-max z-50"
    >
      {/* Dock Container: Dark, pill-shaped, glass effect */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-4 py-3 flex items-end justify-center gap-3 transition-all duration-300 hover:bg-black/50 hover:scale-105 hover:border-white/20">
        
        {dockApps.map((app) => (
          <DockIcon
            key={app.id}
            item={app}
            // Check if it's an open window (only for apps, not links)
            isOpen={!app.isLink && windows[app.id as AppId]?.isOpen}
            onClick={() => handleDockClick(app)}
          />
        ))}
        
        {/* Separator */}
        <div className="w-px h-8 bg-white/10 self-center mx-1" />
        
        <DockIcon
          item={{
            id: 'trash',
            icon: Trash2,
            label: 'Trash',
            color: 'bg-red-500/80'
          }}
          isOpen={false}
          onClick={() => {}}
        />
      </div>
    </motion.div>
  );
};

interface DockIconProps {
  item: DockItem;
  isOpen: boolean;
  onClick: () => void;
}

const DockIcon = ({ item, isOpen, onClick }: DockIconProps) => {
  const Icon = item.icon;
  
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center group"
      whileHover={{ scale: 1.15, y: -12 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Tooltip (Linux Style) */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileHover={{ opacity: 1, y: -5, scale: 1 }}
        className="absolute -top-14 px-3 py-1.5 bg-gray-900/90 backdrop-blur border border-white/10 rounded-lg text-xs font-medium text-white shadow-xl whitespace-nowrap pointer-events-none"
      >
        {item.label}
        {/* Tooltip Arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-r border-b border-white/10" />
      </motion.div>

      {/* Icon Container */}
      <div
        className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:border-white/30 transition-all relative overflow-hidden`}
      >
        {/* Shine effect for links */}
        {item.isLink && (
           <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <Icon className="w-6 h-6 text-white relative z-10" />
      </div>

      {/* Active Indicator (Only for open Apps) */}
      <div className="absolute -bottom-2.5 w-full flex justify-center">
        {isOpen && (
          <motion.div
            layoutId="active-indicator"
            className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </div>
    </motion.button>
  );
};

export default Dock;