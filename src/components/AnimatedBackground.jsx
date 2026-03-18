import { useMemo } from 'react';
import { getWeatherTheme } from '../services/weatherService';

function generateParticles(type, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6,
    size: 2 + Math.random() * 5,
    opacity: 0.2 + Math.random() * 0.5,
  }));
}

export default function AnimatedBackground({ condition }) {
  const theme = getWeatherTheme(condition);

  const particles = useMemo(
    () => generateParticles(theme.particle, getParticleCount(theme.particle)),
    [theme.particle]
  );

  const gradientStyle = {
    background: `linear-gradient(135deg, ${theme.gradient.join(', ')})`,
  };

  return (
    <div className="animated-bg" style={gradientStyle}>
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Mesh gradient blobs */}
      <div className="mesh-gradient">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="mesh-blob mesh-blob-4" />
      </div>

      {/* Weather particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`particle particle-${theme.particle}`}
            style={{
              left: `${p.left}%`,
              top: theme.particle === 'rain' || theme.particle === 'snow' || theme.particle === 'thunder'
                ? '-5%' : `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: theme.particle === 'clouds' || theme.particle === 'mist'
                ? `${60 + p.size * 20}px`
                : `${p.size}px`,
              height: theme.particle === 'rain' || theme.particle === 'thunder'
                ? `${p.size * 6}px`
                : theme.particle === 'clouds' || theme.particle === 'mist'
                  ? `${20 + p.size * 6}px`
                  : `${p.size}px`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="vignette" />
    </div>
  );
}

function getParticleCount(type) {
  switch (type) {
    case 'rain': return 80;
    case 'snow': return 50;
    case 'sun': return 6;
    case 'clouds': return 8;
    case 'thunder': return 70;
    case 'mist': return 10;
    default: return 8;
  }
}
