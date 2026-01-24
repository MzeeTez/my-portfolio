import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// 1. ADD 'snake' and 'tetris' to AppId
export type AppId = 'finder' | 'terminal' | 'safari' | 'mail' | 'vscode' | 'snake' | 'tetris';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

interface WindowContextType {
  windows: Record<AppId, WindowState>;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  maximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  updatePosition: (id: AppId, position: { x: number; y: number }) => void;
  getTopZIndex: () => number;
}

const defaultWindowState = (id: AppId, index: number): WindowState => ({
  id,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  zIndex: 10 + index,
  position: { x: 50 + index * 30, y: 50 + index * 30 },
});

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    finder: defaultWindowState('finder', 0),
    terminal: defaultWindowState('terminal', 1),
    safari: defaultWindowState('safari', 2),
    mail: defaultWindowState('mail', 3),
    vscode: defaultWindowState('vscode', 4),
    // 2. INITIALIZE THE NEW APPS
    snake: defaultWindowState('snake', 5),
    tetris: defaultWindowState('tetris', 6),
  });

  const getTopZIndex = useCallback(() => {
    return Math.max(...Object.values(windows).map(w => w.zIndex)) + 1;
  }, [windows]);

  const openApp = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex)) + 1,
      },
    }));
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      },
    }));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: !prev[id].isMinimized,
      },
    }));
  }, []);

  const maximizeApp = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  }, []);

  const focusApp = useCallback((id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex)) + 1,
      },
    }));
  }, []);

  const updatePosition = useCallback((id: AppId, position: { x: number; y: number }) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        openApp,
        closeApp,
        minimizeApp,
        maximizeApp,
        focusApp,
        updatePosition,
        getTopZIndex,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
};