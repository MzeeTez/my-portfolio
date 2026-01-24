import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import FinderApp from '@/components/apps/FinderApp';
import TerminalApp from '@/components/apps/TerminalApp';
import SafariApp from '@/components/apps/SafariApp';
import MailApp from '@/components/apps/MailApp';
import VSCodeApp from '@/components/apps/VSCodeApp';
import wallpaper from '@/assets/hacker-bg.jpeg';

const Desktop = () => {
  return (
    <div
      className="h-screen w-screen overflow-hidden select-none"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TopBar />
      
      <AnimatePresence mode="popLayout">
        <FinderApp key="finder" />
        <TerminalApp key="terminal" />
        <SafariApp key="safari" />
        <MailApp key="mail" />
        <VSCodeApp key="vscode" />
      </AnimatePresence>

      <Dock />
    </div>
  );
};

export default Desktop;
