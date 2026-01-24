import React, { useState, useEffect, useRef } from 'react';
import Window from '@/components/desktop/Window';

interface HistoryItem {
  type: 'command' | 'output';
  content: React.ReactNode;
}

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandBuffer, setCommandBuffer] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasBooted = useRef(false);

  // --- Auto-Scroll ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // --- Boot Sequence ---
  useEffect(() => {
    if (!hasBooted.current) {
      hasBooted.current = true;
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'command', content: 'neofetch' }]);
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: <NeofetchOutput /> }]);
          setTimeout(() => {
             setHistory(prev => [...prev, { 
                type: 'output', 
                content: <span className="text-gray-500 text-xs">Type <span className="text-yellow-400">'help'</span> to see available commands.</span> 
             }]);
          }, 400);
        }, 300);
      }, 500);
    }
  }, []);

  const handleContainerClick = () => inputRef.current?.focus();

  // --- Commands Logic ---
  const commands: Record<string, (args: string[]) => React.ReactNode> = {
    help: () => (
      <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm max-w-md">
         <span className="text-cyan-400 font-bold">about</span> <span className="text-gray-400">Who is Aditya?</span>
         <span className="text-pink-400 font-bold">projects</span> <span className="text-gray-400">My featured work</span>
         <span className="text-green-400 font-bold">skills</span> <span className="text-gray-400">Tech stack & tools</span>
         <span className="text-purple-400 font-bold">socials</span> <span className="text-gray-400">Github, LinkedIn, etc.</span>
         <span className="text-yellow-400 font-bold">clear</span> <span className="text-gray-400">Clear the screen</span>
         <span className="text-blue-400 font-bold">neofetch</span> <span className="text-gray-400">Show system info</span>
      </div>
    ),
    about: () => (
      <div className="text-gray-300 max-w-lg leading-relaxed">
        I am <span className="text-yellow-400 font-bold">Aditya Kumar Singh</span>, an Android & Flutter Developer based in Kolkata. 
        I specialize in building scalable mobile apps with <span className="text-cyan-400">real-time databases</span> and <span className="text-cyan-400">IoT integrations</span>.
      </div>
    ),
    skills: () => (
      <div className="flex flex-wrap gap-2">
        {['Flutter', 'Dart', 'Java', 'XML', 'Firebase', 'Supabase', 'IoT', 'Git'].map(s => (
          <span key={s} className="px-2 py-0.5 rounded bg-white/10 text-green-300 text-xs border border-white/5">
            {s}
          </span>
        ))}
      </div>
    ),
    projects: () => (
      <div className="space-y-4">
        {[
          { name: 'Auctora', tech: 'Flutter', desc: 'Real-time bidding & e-commerce.' },
          { name: 'EVX', tech: 'Java/IoT', desc: 'P2P EV Charging Network.' },
          { name: 'IEM-Ride', tech: 'Android', desc: 'Carpooling with OSM integration.' },
        ].map(p => (
          <div key={p.name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            <div className="flex items-center gap-2 min-w-[150px]">
               <span className="text-blue-400 font-bold hover:underline cursor-pointer" onClick={() => window.open('https://github.com/MzeeTez', '_blank')}>{p.name}</span>
               <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded border border-white/5">{p.tech}</span>
            </div>
            <span className="text-gray-500 text-sm">{p.desc}</span>
          </div>
        ))}
      </div>
    ),
    socials: () => (
       <div className="flex gap-6">
          <a href="https://github.com/MzeeTez" target="_blank" className="text-blue-400 hover:text-blue-300 hover:underline">GitHub</a>
          <a href="https://linkedin.com" target="_blank" className="text-blue-400 hover:text-blue-300 hover:underline">LinkedIn</a>
          <a href="mailto:adityaaa232004@gmail.com" className="text-blue-400 hover:text-blue-300 hover:underline">Email</a>
       </div>
    ),
    neofetch: () => <NeofetchOutput />,
    clear: () => null,
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;
    setHistory(prev => [...prev, { type: 'command', content: trimmed }]);
    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();

    if (cmd === 'clear') {
      // RESET to the 'booted' state instead of empty array
      setHistory([
        { type: 'command', content: 'neofetch' },
        { type: 'output', content: <NeofetchOutput /> },
        { 
          type: 'output', 
          content: <span className="text-gray-500 text-xs">Type <span className="text-yellow-400">'help'</span> to see available commands.</span> 
        }
      ]);
    } else {
      const output = commands[cmd] 
        ? commands[cmd](args.slice(1)) 
        : <span className="text-red-400">command not found: {cmd}</span>;
      setHistory(prev => [...prev, { type: 'output', content: output }]);
    }
    setCommandBuffer(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') executeCommand(input);
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandBuffer.length > 0) {
        const newIdx = historyIndex === -1 ? commandBuffer.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(commandBuffer[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIdx = Math.min(commandBuffer.length - 1, historyIndex + 1);
        if (historyIndex === commandBuffer.length - 1) { setHistoryIndex(-1); setInput(''); } 
        else { setHistoryIndex(newIdx); setInput(commandBuffer[newIdx]); }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = Object.keys(commands).find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  return (
    <Window id="terminal" title="aditya@terminal: ~" width={750} height={500}>
      <div 
        className="h-full bg-[#1e1e1e]/95 backdrop-blur-md p-4 font-mono text-sm overflow-hidden flex flex-col select-text"
        onClick={handleContainerClick}
      >
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-1 pb-4">
          {history.map((item, i) => (
            <div key={i} className={`${item.type === 'command' ? 'mt-3' : ''}`}>
              {item.type === 'command' ? (
                <div className="flex items-center gap-2">
                   <span className="text-yellow-400">➜</span>
                   <span className="text-cyan-400">~</span>
                   <span className="text-white">{item.content}</span>
                </div>
              ) : (
                <div className="text-gray-300 ml-0 mt-1">
                   {item.content}
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400">➜</span>
            <span className="text-cyan-400">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white caret-gray-400 placeholder-gray-700"
              autoFocus
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </Window>
  );
};

// --- Sub-Component: Neofetch Output ---
const NeofetchOutput = () => {
  const [displayedAscii, setDisplayedAscii] = useState('');
  const fullAscii = ` █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║
███████║██║  ██║██║
██╔══██║██║  ██║██║
██║  ██║██████╔╝██║
╚═╝  ╚═╝╚═════╝ ╚═╝`;

  // Typing Effect Loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startAnimation = () => {
      let index = 0;
      setDisplayedAscii(''); // Reset text
      
      intervalId = setInterval(() => {
        index++;
        setDisplayedAscii(fullAscii.substring(0, index));
        
        if (index >= fullAscii.length) {
          clearInterval(intervalId);
          // Wait 3 seconds, then restart
          timeoutId = setTimeout(startAnimation, 1500);
        }
      }, 5); // 5ms per char speed
    };

    startAnimation();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-2 mb-4 items-start animate-in fade-in duration-500">
       {/* ASCII Logo: Animated Typing */}
       <div className="text-blue-500 font-bold leading-[1.15] select-none whitespace-pre text-left min-h-[105px]">
          {displayedAscii}
       </div>
       
       {/* Info Table */}
       <div className="flex flex-col justify-center w-full">
          <div className="flex gap-2 mb-2">
             <span className="text-blue-400 font-bold">Aditya</span>
             <span className="text-gray-400">@</span>
             <span className="text-blue-400 font-bold">terminal-pro</span>
          </div>
          <div className="text-gray-600 text-xs mb-3">---------------------------</div>
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <InfoRow label="OS" value="Portfolio v2.0" color="text-yellow-400" />
            <InfoRow label="Host" value="Chrome Browser" color="text-green-400" />
            <InfoRow label="Uptime" value="Just now" color="text-pink-400" />
            <InfoRow label="Role" value="Android Developer" color="text-cyan-400" />
            <InfoRow label="Location" value="Kolkata, India" color="text-purple-400" />
            <InfoRow label="Status" value="Open to Work" color="text-red-400" />
          </div>

          {/* Color Bars */}
          <div className="flex gap-2 mt-4">
             <div className="w-3 h-3 bg-black rounded-full"></div>
             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
             <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
             <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
             <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
       </div>
    </div>
  );
};

const InfoRow = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <>
     <span className={`font-bold ${color} text-right`}>{label}</span>
     <span className="text-gray-300">{value}</span>
  </>
);

export default TerminalApp;