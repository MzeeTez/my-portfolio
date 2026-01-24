import Window from '@/components/desktop/Window';
import { Files, Search, GitBranch, Bug, Blocks, ChevronRight, ChevronDown } from 'lucide-react';

const codeSnippet = `// Hello.tsx - Welcome Component
import { motion } from 'framer-motion';

interface HelloProps {
  name: string;
  role?: string;
}

export const Hello = ({ name, role }: HelloProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="greeting-container"
    >
      <h1>Hello, I'm {name}! 👋</h1>
      {role && <p>I'm a {role}</p>}
      <p>Welcome to my portfolio.</p>
    </motion.div>
  );
};

// Usage
<Hello 
  name="Aditya" 
  role="Android Developer" 
/>`;

const VSCodeApp = () => {
  const lineNumbers = codeSnippet.split('\n').map((_, i) => i + 1);

  const sidebarItems = [
    { icon: Files, active: true },
    { icon: Search },
    { icon: GitBranch },
    { icon: Bug },
    { icon: Blocks },
  ];

  return (
    <Window id="vscode" title="Visual Studio Code" width={850} height={550}>
      <div className="flex h-full bg-[#1e1e1e]">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              className={`p-2 rounded ${
                item.active ? 'text-white border-l-2 border-primary' : 'text-[#858585] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Explorer */}
        <div className="w-48 bg-[#252526] border-r border-[#3c3c3c] text-[13px]">
          <div className="p-2 text-[#cccccc] text-xs uppercase tracking-wider">Explorer</div>
          <div className="px-2">
            <div className="flex items-center gap-1 py-1 text-[#cccccc] cursor-pointer hover:bg-[#2a2d2e] rounded">
              <ChevronDown className="w-4 h-4" />
              <span>src</span>
            </div>
            <div className="ml-4">
              <div className="flex items-center gap-1 py-1 text-[#cccccc] cursor-pointer hover:bg-[#2a2d2e] rounded">
                <ChevronRight className="w-4 h-4" />
                <span>components</span>
              </div>
              <div className="flex items-center gap-1 py-1 text-[#cccccc] cursor-pointer bg-[#094771] rounded pl-4">
                <span className="text-[#519aba]">Hello.tsx</span>
              </div>
              <div className="flex items-center gap-1 py-1 text-[#cccccc] cursor-pointer hover:bg-[#2a2d2e] rounded pl-4">
                <span className="text-[#519aba]">App.tsx</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-9 bg-[#252526] flex items-center border-b border-[#3c3c3c]">
            <div className="px-4 py-2 bg-[#1e1e1e] text-[#cccccc] text-sm border-t-2 border-primary flex items-center gap-2">
              <span className="text-[#519aba]">TS</span>
              Hello.tsx
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 overflow-auto">
            <div className="flex text-[13px] font-mono leading-[1.5]">
              {/* Line Numbers */}
              <div className="w-12 text-right pr-4 pt-2 text-[#858585] select-none bg-[#1e1e1e]">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Code */}
              <pre className="flex-1 pt-2 pl-2 text-[#d4d4d4] overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] flex items-center justify-between px-2 text-[11px] text-white">
            <div className="flex items-center gap-3">
              <span>main</span>
              <span>0 Problems</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln 1, Col 1</span>
              <span>TypeScript React</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default VSCodeApp;
