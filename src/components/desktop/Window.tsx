import { motion, useDragControls, PanInfo } from 'framer-motion';
import { useWindows, AppId } from '@/contexts/WindowContext';
import { X, Minus, Square } from 'lucide-react';
import { ReactNode, useRef, useState, useEffect } from 'react';

interface WindowProps {
  id: AppId;
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
  className?: string;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const Window = ({ id, title, children, width = 700, height = 500, className = '' }: WindowProps) => {
  const { windows, closeApp, minimizeApp, maximizeApp, focusApp, updatePosition, updateSize } = useWindows();
  const windowState = windows[id];
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);

  // Initialize size if needed
  useEffect(() => {
    if (windowState.size.width === 700 && width !== 700) {
        updateSize(id, { width, height });
    }
  }, []);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const handlePointerDown = () => {
    focusApp(id);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (windowState.isMaximized) return;
    const newX = windowState.position.x + info.offset.x;
    const newY = windowState.position.y + info.offset.y;
    updatePosition(id, { x: newX, y: newY });
  };

  const startResize = (e: React.PointerEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.size.width;
    const startHeight = windowState.size.height;
    const startPosX = windowState.position.x;
    const startPosY = windowState.position.y;

    // Set cursor globally during drag
    const cursorMap: Record<ResizeDirection, string> = {
        n: 'ns-resize', s: 'ns-resize',
        e: 'ew-resize', w: 'ew-resize',
        ne: 'nesw-resize', sw: 'nesw-resize',
        nw: 'nwse-resize', se: 'nwse-resize'
    };
    document.body.style.cursor = cursorMap[direction];

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      // Calculate Width & X
      if (direction.includes('e')) {
        newWidth = Math.max(300, startWidth + deltaX);
      } else if (direction.includes('w')) {
        const proposedWidth = startWidth - deltaX;
        if (proposedWidth >= 300) {
            newWidth = proposedWidth;
            newX = startPosX + deltaX;
        }
      }

      // Calculate Height & Y
      if (direction.includes('s')) {
        newHeight = Math.max(200, startHeight + deltaY);
      } else if (direction.includes('n')) {
        const proposedHeight = startHeight - deltaY;
        if (proposedHeight >= 200) {
            newHeight = proposedHeight;
            newY = startPosY + deltaY;
        }
      }

      updateSize(id, { width: newWidth, height: newHeight });
      // Only update position if it changed (resizing left or top)
      if (newX !== startPosX || newY !== startPosY) {
          updatePosition(id, { x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        width: windowState.isMaximized ? '100vw' : windowState.size.width,
        height: windowState.isMaximized ? 'calc(100vh - 28px)' : windowState.size.height,
        x: windowState.isMaximized ? 0 : windowState.position.x,
        y: windowState.isMaximized ? 0 : windowState.position.y,
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      drag={!windowState.isMaximized && !isResizing}
      dragControls={dragControls}
      dragListener={false} 
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: windowState.zIndex,
      }}
      className={`bg-card/90 backdrop-blur-xl rounded-xl window-shadow flex flex-col border border-white/10 ${className}`}
    >
      {/* --- RESIZE HANDLES (Invisible but draggable) --- */}
      {!windowState.isMaximized && (
        <>
            {/* Top */}
            <div className="absolute -top-1 left-2 right-2 h-2 cursor-ns-resize z-50" onPointerDown={(e) => startResize(e, 'n')} />
            {/* Bottom */}
            <div className="absolute -bottom-1 left-2 right-2 h-2 cursor-ns-resize z-50" onPointerDown={(e) => startResize(e, 's')} />
            {/* Left */}
            <div className="absolute top-2 bottom-2 -left-1 w-2 cursor-ew-resize z-50" onPointerDown={(e) => startResize(e, 'w')} />
            {/* Right */}
            <div className="absolute top-2 bottom-2 -right-1 w-2 cursor-ew-resize z-50" onPointerDown={(e) => startResize(e, 'e')} />
            
            {/* Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 cursor-nwse-resize z-50" onPointerDown={(e) => startResize(e, 'nw')} />
            <div className="absolute -top-1 -right-1 w-4 h-4 cursor-nesw-resize z-50" onPointerDown={(e) => startResize(e, 'ne')} />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 cursor-nesw-resize z-50" onPointerDown={(e) => startResize(e, 'sw')} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 cursor-nwse-resize z-50" onPointerDown={(e) => startResize(e, 'se')} />
        </>
      )}

      {/* Window Header */}
      <div
        className="h-10 bg-white/5 border-b border-white/10 flex items-center px-3 gap-3 cursor-move select-none relative z-40"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); closeApp(id); }} className="traffic-light traffic-red group flex items-center justify-center">
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); minimizeApp(id); }} className="traffic-light traffic-yellow group flex items-center justify-center">
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); maximizeApp(id); }} className="traffic-light traffic-green group flex items-center justify-center">
            <Square className="w-1.5 h-1.5 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <span className="flex-1 text-center text-sm font-medium text-foreground/80 -ml-16">
          {title}
        </span>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto relative z-10">
          {children}
      </div>
    </motion.div>
  );
};

export default Window;