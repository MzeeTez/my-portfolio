import { WindowProvider } from '@/contexts/WindowContext';
import Desktop from '@/components/desktop/Desktop';
import MobileView from '@/components/mobile/MobileView';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView />;
  }

  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  );
};

export default Index;
