import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const FloatingParticles = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const getParticleColor = () => {
    switch (theme) {
      case 'dark': return 'rgba(255, 255, 255, 0.1)';
      case 'smokey': return 'rgba(255, 255, 255, 0.15)';
      default: return 'rgba(0, 0, 0, 0.08)';
    }
  };

  return (
    <div className="absolute inset-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: getParticleColor(),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
};