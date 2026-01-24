import { useState, useEffect } from 'react';
import Window from '@/components/desktop/Window';
import { motion } from 'framer-motion';

const skills = [
  { category: 'Languages', items: ['C', 'Java', 'Python', 'XML', 'Dart'] },
  { category: 'Frameworks', items: ['Flutter', 'Android SDK', 'Java Collections'] },
  { category: 'Databases', items: ['SQLite', 'Firebase', 'Supabase', 'MySQL'] },
  { category: 'Tools', items: ['Git', 'GitHub', 'Android Studio', 'VS Code'] },
];

const TerminalApp = () => {
  const [lines, setLines] = useState<string[]>([
    '$ neofetch',
    '',
    '   ██╗  ██╗    Aditya Kumar Singh',
    '   ██║  ██║    ─────────────────',
    '   ███████║    OS: macOS Portfolio v1.0',
    '   ██╔══██║    Role: Android Developer',
    '   ██║  ██║    Location: Kolkata, India',
    '   ╚═╝  ╚═╝    ',
    '',
    '$ echo $SKILLS',
  ]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentSkillIndex < skills.length) {
      const timeout = setTimeout(() => {
        const skill = skills[currentSkillIndex];
        setLines((prev) => [
          ...prev,
          '',
          `→ ${skill.category}:`,
          `  [${skill.items.join(', ')}]`,
        ]);
        setCurrentSkillIndex((prev) => prev + 1);
      }, 800 + currentSkillIndex * 600);
      return () => clearTimeout(timeout);
    }
  }, [currentSkillIndex]);

  return (
    <Window id="terminal" title="Terminal — Skills" width={650} height={450}>
      <div className="terminal-bg h-full p-4 font-mono text-sm overflow-auto">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="terminal-text whitespace-pre"
          >
            {line}
          </motion.div>
        ))}
        {currentSkillIndex >= skills.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="terminal-text mt-4 flex items-center"
          >
            <span>$ </span>
            <span
              className={`inline-block w-2 h-4 ml-1 ${
                showCursor ? 'bg-[hsl(var(--terminal-text))]' : 'bg-transparent'
              }`}
            />
          </motion.div>
        )}
      </div>
    </Window>
  );
};

export default TerminalApp;
