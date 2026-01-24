import { motion } from 'framer-motion';
import { Folder, Terminal, Globe, Mail, Code2, Trash2 } from 'lucide-react';
import { useWindows, AppId } from '@/contexts/WindowContext';

const dockApps = [
  { id: 'finder' as AppId, icon: Folder, label: 'Finder', color: 'bg-blue-500' },
  { id: 'terminal' as AppId, icon: Terminal, label: 'Terminal', color: 'bg-gray-800' },
  { id: 'safari' as AppId, icon: Globe, label: 'Safari', color: 'bg-blue-400' },
  { id: 'mail' as AppId, icon: Mail, label: 'Mail', color: 'bg-blue-600' },
  { id: 'vscode' as AppId, icon: Code2, label: 'VS Code', color: 'bg-blue-700' },
];

const Dock = () => {
  const { windows, openApp, minimizeApp } = useWindows();

  const handleDockClick = (id: AppId) => {
    if (windows[id].isOpen && !windows[id].isMinimized) {
      minimizeApp(id);
    } else {
      openApp(id);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glass-dock rounded-2xl px-2 py-1.5 flex items-end gap-1">
        {dockApps.map((app) => (
          <DockIcon
            key={app.id}
            {...app}
            isOpen={windows[app.id].isOpen}
            onClick={() => handleDockClick(app.id)}
          />
        ))}
        <div className="w-px h-10 bg-foreground/10 mx-1" />
        <DockIcon
          id={'trash' as AppId}
          icon={Trash2}
          label="Trash"
          color="bg-gray-500"
          isOpen={false}
          onClick={() => {}}
        />
      </div>
    </motion.div>
  );
};

interface DockIconProps {
  id: AppId;
  icon: React.ElementType;
  label: string;
  color: string;
  isOpen: boolean;
  onClick: () => void;
}

const DockIcon = ({ icon: Icon, label, color, isOpen, onClick }: DockIconProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center group"
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-10 px-3 py-1 glass rounded-md text-xs font-medium text-foreground whitespace-nowrap pointer-events-none"
      >
        {label}
      </motion.div>

      {/* Icon Container */}
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Active Indicator */}
      {isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-foreground/60"
        />
      )}
    </motion.button>
  );
};

export default Dock;
