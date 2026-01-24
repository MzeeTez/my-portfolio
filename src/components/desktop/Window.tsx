import { motion, useDragControls } from 'framer-motion';
import { useWindows, AppId } from '@/contexts/WindowContext';
import { X, Minus, Square } from 'lucide-react';
import { ReactNode, useRef } from 'react';

interface WindowProps {
  id: AppId;
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
  className?: string;
}

const Window = ({ id, title, children, width = 700, height = 500, className = '' }: WindowProps) => {
  const { windows, closeApp, minimizeApp, maximizeApp, focusApp, updatePosition } = useWindows();
  const windowState = windows[id];
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const handlePointerDown = () => {
    focusApp(id);
  };

  return (
    <>
      {/* Drag constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" style={{ top: 28 }} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          width: windowState.isMaximized ? '100vw' : width,
          height: windowState.isMaximized ? 'calc(100vh - 28px - 80px)' : height,
          x: windowState.isMaximized ? 0 : undefined,
          y: windowState.isMaximized ? 0 : undefined,
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        drag={!windowState.isMaximized}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={constraintsRef}
        onPointerDown={handlePointerDown}
        style={{
          position: 'fixed',
          left: windowState.isMaximized ? 0 : windowState.position.x,
          top: windowState.isMaximized ? 28 : windowState.position.y,
          zIndex: windowState.zIndex,
        }}
        className={`bg-card/95 backdrop-blur-xl rounded-xl window-shadow overflow-hidden flex flex-col ${className}`}
      >
        {/* Window Header */}
        <div
          className="h-10 bg-[hsl(var(--window-header))] border-b border-[hsl(var(--window-border))] flex items-center px-3 gap-3 cursor-move select-none"
          onPointerDown={(e) => dragControls.start(e)}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => closeApp(id)}
              className="traffic-light traffic-red group flex items-center justify-center"
            >
              <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => minimizeApp(id)}
              className="traffic-light traffic-yellow group flex items-center justify-center"
            >
              <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => maximizeApp(id)}
              className="traffic-light traffic-green group flex items-center justify-center"
            >
              <Square className="w-1.5 h-1.5 text-green-900 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* Title */}
          <span className="flex-1 text-center text-sm font-medium text-foreground/80 -ml-16">
            {title}
          </span>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </motion.div>
    </>
  );
};

export default Window;
