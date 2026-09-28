// Lightweight, robust confetti engine without external library dependencies
// Guarantees no "canvas.getBoundingClientRect is not a function" errors in iframes/PWA

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  decay: number;
}

export function fireConfetti(options: ConfettiOptions = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    const particleCount = options.particleCount || 60;
    const spread = options.spread || 70;
    const originX = (options.origin?.x ?? 0.5) * window.innerWidth;
    const originY = (options.origin?.y ?? 0.6) * window.innerHeight;
    const colors = options.colors || ['#D9A184', '#8FA377', '#E5B59C', '#B98F72', '#F3EFEA'];

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    const particles: Particle[] = [];
    const spreadRad = (spread * Math.PI) / 180;

    for (let i = 0; i < particleCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad;
      const speed = 7 + Math.random() * 8;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        decay: 0.012 + Math.random() * 0.015,
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        if (p.opacity > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // gravity
          p.vx *= 0.98; // air resistance
          p.rotation += p.rotationSpeed;
          p.opacity -= p.decay;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      }

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationId);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };

    animationId = requestAnimationFrame(render);
  } catch (e) {
    // Fail silently without disrupting the application
    console.warn('Confetti animation error caught:', e);
  }
}

export default fireConfetti;
