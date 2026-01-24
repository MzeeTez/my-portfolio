import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '@/components/desktop/Window';
import { 
  ArrowLeft, ArrowRight, RotateCw, Lock, Share, Plus, 
  WifiOff, Search, X, Star, Bot, Zap, Globe, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Data ---
interface Project {
  name: string;
  description: string;
  tech: string[];
  date: string;
  url: string;
  color: string;
}

const projects: Project[] = [
  {
    name: 'Auctora',
    description: 'Real-time bidding marketplace with live auction rooms and secure checkout.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    date: 'Sept 2025',
    url: 'auctora.app',
    color: 'bg-blue-500'
  },
  {
    name: 'EVX',
    description: 'Peer-to-peer EV charging network connecting donors and acceptors via real-time maps.',
    tech: ['Java', 'XML', 'OSM'],
    date: 'May 2025',
    url: 'evx.network',
    color: 'bg-green-500'
  },
  {
    name: 'AutoUpKeep',
    description: 'IoT-integrated machine monitoring system with predictive maintenance analytics.',
    tech: ['Java', 'Android', 'IoT'],
    date: 'Aug 2025',
    url: 'autoupkeep.io',
    color: 'bg-orange-500'
  },
  {
    name: 'IEM-Ride',
    description: 'Carpooling platform for students featuring ride-sharing and split payments.',
    tech: ['Java', 'Firebase', 'Maps'],
    date: 'Sept 2025',
    url: 'iemride.com',
    color: 'bg-purple-500'
  },
];

// --- Sub-Component: The Game ---
const GAME_SPEED = 5;
const JUMP_STRENGTH = 12;
const GRAVITY = 0.6;

const DinoGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game Refs for Loop (Avoiding Re-renders)
  const dinoRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  
  // Physics State (Mutable for performance)
  const gameState = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    obstacleX: 600, // Start off-screen
    isJumping: false
  });

  const resetGame = () => {
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
    gameState.current = { dinoY: 0, dinoVelocity: 0, obstacleX: 600, isJumping: false };
    gameLoop();
  };

  const jump = useCallback(() => {
    if (!isPlaying) {
        if (isGameOver) resetGame();
        else setIsPlaying(true);
        return;
    }
    // Only jump if on ground
    if (gameState.current.dinoY === 0) {
      gameState.current.dinoVelocity = JUMP_STRENGTH;
      gameState.current.isJumping = true;
    }
  }, [isPlaying, isGameOver]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const gameLoop = () => {
    const state = gameState.current;

    // 1. Physics: Gravity & Jumping
    if (state.dinoY > 0 || state.isJumping) {
      state.dinoY += state.dinoVelocity;
      state.dinoVelocity -= GRAVITY;
      
      // Hit ground
      if (state.dinoY <= 0) {
        state.dinoY = 0;
        state.dinoVelocity = 0;
        state.isJumping = false;
      }
    }

    // 2. Obstacle Movement
    state.obstacleX -= GAME_SPEED + (score * 0.005); // Slight speed up
    if (state.obstacleX < -20) {
      state.obstacleX = 600; // Reset
      setScore(s => s + 1);
    }

    // 3. Collision Detection
    // Simple AABB (Axis-Aligned Bounding Box)
    // Dino is roughly 10-40px from left, 0-40px high
    const dinoHitbox = { x: 20, y: state.dinoY, w: 30, h: 30 };
    const obstacleHitbox = { x: state.obstacleX, y: 0, w: 20, h: 30 };

    if (
      dinoHitbox.x < obstacleHitbox.x + obstacleHitbox.w &&
      dinoHitbox.x + dinoHitbox.w > obstacleHitbox.x &&
      dinoHitbox.y < obstacleHitbox.y + obstacleHitbox.h
    ) {
      // Collision!
      setIsPlaying(false);
      setIsGameOver(true);
      setHighScore(prev => Math.max(prev, score));
      cancelAnimationFrame(requestRef.current!);
      return; // Stop loop
    }

    // 4. Update DOM via Refs (Direct Manipulation for Performance)
    if (dinoRef.current) {
      dinoRef.current.style.bottom = `${state.dinoY}px`;
    }
    if (obstacleRef.current) {
      obstacleRef.current.style.left = `${state.obstacleX}px`;
    }

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Start/Stop Loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#f7f7f7] text-gray-800 relative overflow-hidden font-mono" onClick={jump}>
       
       {/* Score Board */}
       <div className="absolute top-10 right-10 text-right">
          <div className="text-2xl font-bold text-gray-800">HI {highScore.toString().padStart(5, '0')}</div>
          <div className="text-xl text-gray-500">{score.toString().padStart(5, '0')}</div>
       </div>

       {/* Game Container */}
       <div className="relative w-full max-w-2xl h-64 border-b-2 border-gray-800 bg-white overflow-hidden shadow-sm">
          
          {/* Start / Game Over Screen */}
          {(!isPlaying || isGameOver) && (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                {isGameOver ? (
                   <>
                     <h2 className="text-3xl font-bold mb-2 text-red-600">GAME OVER</h2>
                     <button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full hover:scale-105 transition-transform">
                        <RotateCw className="w-4 h-4" /> Try Again
                     </button>
                   </>
                ) : (
                   <div className="text-center animate-pulse">
                      <WifiOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 text-sm mb-4">No Internet Connection</p>
                      <button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                         Start Game
                      </button>
                      <p className="mt-4 text-xs text-gray-400">Press Space to Jump</p>
                   </div>
                )}
             </div>
          )}

          {/* DINO (Player) */}
          <div 
             ref={dinoRef}
             className="absolute bottom-0 left-5 w-10 h-10 text-gray-800 z-10"
             style={{ bottom: 0 }}
          >
             <Bot className="w-full h-full" />
          </div>

          {/* OBSTACLE */}
          <div 
             ref={obstacleRef}
             className="absolute bottom-0 text-red-500 z-10"
             style={{ left: 600 }}
          >
             <Zap className="w-6 h-8 fill-current" />
          </div>

          {/* Clouds (Decoration) */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute top-10 left-0 text-gray-300"
          >
             ☁️
          </motion.div>
       </div>

       <div className="mt-8 text-center space-y-2">
         <p className="text-xs text-gray-400 uppercase tracking-widest">System Offline</p>
         <p className="text-sm text-gray-500">Turn on Wi-Fi in the top bar to browse projects.</p>
       </div>
    </div>
  );
};

// --- Sub-Component: Project Card ---
const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
  >
    {/* Color Header */}
    <div className={`h-2 w-full ${project.color}`} />
    
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${project.color} bg-opacity-10`}>
             <Star className={`w-4 h-4 ${project.color.replace('bg-', 'text-')}`} />
          </div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {project.name}
          </h3>
        </div>
        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">
          {project.date}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] rounded-md bg-secondary border border-border/50 text-secondary-foreground font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
    </div>
  </motion.div>
);

// --- Sub-Component: New Tab (Search) ---
const NewTab = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background">
       <div className="w-full max-w-lg flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-4">
             <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
                <Globe className="w-10 h-10 text-white" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight">Search the Web</h2>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                <Search className="w-5 h-5" />
             </div>
             <input 
               type="text" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Search Google or type a URL..."
               className="w-full h-12 pl-12 pr-4 rounded-full border border-border bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
               autoFocus
             />
          </form>

          {/* Quick Links */}
          <div className="grid grid-cols-4 gap-4 w-full pt-4">
             {['GitHub', 'LinkedIn', 'Twitter', 'Gmail'].map((site) => (
                <button key={site} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary/50 transition-colors group">
                   <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                      <ExternalLink className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{site}</span>
                </button>
             ))}
          </div>
       </div>
    </div>
  );
};

// --- Main Component ---
interface SafariAppProps {
  isWifiOn: boolean;
}

interface Tab {
  id: string;
  title: string;
  type: 'projects' | 'search';
}

const SafariApp = ({ isWifiOn }: SafariAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Tab Management
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'projects', title: 'My Projects', type: 'projects' }
  ]);
  const [activeTabId, setActiveTabId] = useState('projects');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleAddTab = () => {
    const newTabId = `tab-${Date.now()}`;
    setTabs([...tabs, { id: newTabId, title: 'New Tab', type: 'search' }]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing last tab
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  // Google Search Handler
  const performGoogleSearch = (query: string) => {
    if (!isWifiOn) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  // Handle Toolbar Refresh
  const handleRefresh = () => {
    if (!isWifiOn) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Filter Projects (Only relevant if active tab is projects)
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Window id="safari" title="Safari" width={950} height={650}>
      <div className="h-full flex flex-col bg-[#fbfbfd] dark:bg-background">
        
        {/* --- 1. Tab Bar --- */}
        <div className="flex items-end px-2 pt-2 bg-[#dee1e6] dark:bg-muted/30 border-b border-border gap-1 overflow-x-auto no-scrollbar">
           <div className="flex-1 flex gap-1">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2 min-w-[120px] max-w-[200px] text-xs font-medium rounded-t-lg transition-all cursor-pointer ${
                    activeTabId === tab.id 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'hover:bg-background/50 text-muted-foreground'
                  }`}
                >
                   <span className={`w-2 h-2 rounded-full ${tab.type === 'projects' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                   <span className="truncate flex-1">{tab.title}</span>
                   
                   {/* Close Button */}
                   <button 
                     onClick={(e) => handleCloseTab(tab.id, e)}
                     className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${tabs.length === 1 ? 'hidden' : ''}`}
                   >
                     <X className="w-3 h-3" />
                   </button>
                </div>
              ))}
              
              <button 
                onClick={handleAddTab}
                className="px-3 py-2 text-muted-foreground hover:bg-background/50 rounded-t-lg transition-colors ml-1"
                title="New Tab"
              >
                 <Plus className="w-3 h-3" />
              </button>
           </div>
        </div>

        {/* --- 2. Navigation & Toolbar --- */}
        <div className="flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="flex gap-1">
             <button className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 transition-colors" disabled>
               <ArrowLeft className="w-4 h-4 text-muted-foreground" />
             </button>
             <button className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 transition-colors" disabled>
               <ArrowRight className="w-4 h-4 text-muted-foreground" />
             </button>
          </div>
          
          <button onClick={handleRefresh} className="p-1.5 rounded-md hover:bg-accent transition-colors group">
            <RotateCw className={`w-4 h-4 text-muted-foreground group-hover:text-primary ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Address Bar */}
          <div className="flex-1 group flex items-center gap-2 bg-secondary/30 hover:bg-secondary/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all rounded-lg px-3 py-2 mx-2 border border-transparent focus-within:border-primary/30">
            {isWifiOn ? <Lock className="w-3 h-3 text-green-600" /> : <WifiOff className="w-3 h-3 text-red-500" />}
            
            <div className="flex-1 flex flex-col justify-center h-full">
               <span className="text-[10px] text-muted-foreground font-medium -mb-1">
                  {isWifiOn ? 'https://' : ''}
                  {activeTab.type === 'projects' ? 'aditya.dev/projects' : 'google.com'}
               </span>
               <input 
                 type="text" 
                 placeholder={activeTab.type === 'projects' ? "Filter projects..." : "Search Google..."}
                 className="bg-transparent border-none outline-none text-sm w-full h-5 p-0 placeholder:text-muted-foreground/50"
                 // If searching in 'projects' tab, filter. If in 'search' tab, handle google search.
                 value={activeTab.type === 'projects' ? searchQuery : ''}
                 onChange={(e) => {
                    if (activeTab.type === 'projects') setSearchQuery(e.target.value);
                 }}
                 onKeyDown={(e) => {
                    if (e.key === 'Enter' && activeTab.type === 'search') {
                       performGoogleSearch((e.target as HTMLInputElement).value);
                    }
                 }}
                 disabled={!isWifiOn}
               />
            </div>
            
            {isLoading && <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />}
          </div>
          
          <button className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-primary">
            <Share className="w-4 h-4" />
          </button>
          <button onClick={handleAddTab} className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* --- 3. Loading Bar (Fake) --- */}
        {isLoading && (
           <motion.div 
             initial={{ width: '0%' }} 
             animate={{ width: '100%' }} 
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="h-0.5 bg-blue-500 w-full"
           />
        )}

        {/* --- 4. Main Content Area --- */}
        <div className="flex-1 relative overflow-hidden bg-background">
          {!isWifiOn ? (
            <DinoGame />
          ) : (
            <div className="h-full w-full">
              {/* Conditional Render based on Tab Type */}
              {activeTab.type === 'projects' ? (
                 <div className="h-full overflow-y-auto p-8 custom-scrollbar">
                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-8">
                       <h1 className="text-3xl font-bold mb-2 tracking-tight">Software Projects</h1>
                       <p className="text-muted-foreground">
                          A collection of applications, tools, and experiments built with modern web technologies.
                       </p>
                    </div>
      
                    {/* Grid */}
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                      <AnimatePresence mode='popLayout'>
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
                            <ProjectCard key={project.name} project={project} />
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center text-muted-foreground"
                          >
                             <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                             <p>No projects found matching "{searchQuery}"</p>
                             <button onClick={() => setSearchQuery('')} className="text-primary hover:underline mt-2 text-sm">Clear Search</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                 </div>
              ) : (
                 <NewTab onSearch={performGoogleSearch} />
              )}
            </div>
          )}
        </div>

        {/* --- 5. Status Bar --- */}
        <div className="px-4 py-1 bg-secondary/30 border-t border-border flex justify-between text-[10px] text-muted-foreground select-none">
           <span>{activeTab.type === 'projects' ? `${filteredProjects.length} items` : 'New Tab'}</span>
           <span>{isWifiOn ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
    </Window>
  );
};

export default SafariApp;