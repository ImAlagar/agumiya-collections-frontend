// src/components/ui/hero/ResponsiveHero.jsx
import { useState, useEffect } from 'react';
import DesktopHero3D from './DesktopHero3D';
import MobileHero from './MobileHero';

const ResponsiveHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024); // Switch at lg breakpoint (1024px)
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile ? <MobileHero /> : <DesktopHero3D />;
};

export default ResponsiveHero;