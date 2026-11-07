import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/* ===== Mipangilio ya mandharinyuma (badilisha hapa tu) ===== */
const CONFIG = {
  // Chagua: 'bubbles' | 'fireflies' | 'waves' | 'stars' | 'mix'
  STYLE: 'mix',

  BUBBLES: {
    COUNT: 38, // idadi ya mapovu
    SPEED: 0.55, // kasi ya kupanda
    COLOR: '125, 220, 255', // RGB
  },
  FIREFLIES: {
    COUNT: 45, // idadi ya vimulimuli
    SPEED: 0.45, // kasi ya kuelea
    COLOR: '212, 175, 55', // RGB (dhahabu)
  },
  WAVES: {
    COUNT: 4, // idadi ya mawimbi
    SPEED: 0.0005, // kasi ya mawimbi (ndogo = polepole zaidi, mfano 0.0003)
    SWELL: 6, // kupanda na kushuka taratibu kwa mawimbi (pixels), 0 = kuzima
    COLOR: '56, 189, 248', // RGB
  },
  STARS: {
    COUNT: 120, // idadi ya nyota
    COLOR: '255, 255, 255', // RGB
    SHOOTING_EVERY: 170, // nyota inayopita kila baada ya frames ngapi
  },
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (a, b) => a + Math.random() * (b - a);

/* ===== Tabaka za mandharinyuma =====
   Kila tabaka linarudisha function ya draw(ctx, w, h, t, animate) */

function createBubbles(w, h) {
  const { COUNT, SPEED, COLOR } = CONFIG.BUBBLES;
  const scale = clamp((w * h) / (1280 * 720), 0.4, 1.2);
  const items = Array.from({ length: Math.round(COUNT * scale) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(4, 20),
    vy: rand(0.4, 1) * SPEED,
    phase: rand(0, Math.PI * 2),
  }));

  return (ctx, W, H, t, animate) => {
    for (const b of items) {
      if (animate) {
        b.y -= b.vy;
        b.x += Math.sin(t * 0.02 + b.phase) * 0.35;
        if (b.y < -b.r * 2) {
          b.y = H + b.r * 2;
          b.x = rand(0, W);
        }
      }
      const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(${COLOR}, 0.28)`);
      g.addColorStop(1, `rgba(${COLOR}, 0.04)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(${COLOR}, 0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // mng'ao mdogo juu ya povu
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 0.65, Math.PI * 1.15, Math.PI * 1.45);
      ctx.stroke();
    }
  };
}

function createFireflies(w, h) {
  const { COUNT, SPEED, COLOR } = CONFIG.FIREFLIES;
  const scale = clamp((w * h) / (1280 * 720), 0.4, 1.2);
  const items = Array.from({ length: Math.round(COUNT * scale) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    angle: rand(0, Math.PI * 2),
    speed: rand(0.4, 1) * SPEED,
    phase: rand(0, Math.PI * 2),
    r: rand(1.4, 2.8),
  }));

  return (ctx, W, H, t, animate) => {
    for (const f of items) {
      if (animate) {
        f.angle += (Math.random() - 0.5) * 0.12;
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;
        if (f.x < -10) f.x = W + 10;
        if (f.x > W + 10) f.x = -10;
        if (f.y < -10) f.y = H + 10;
        if (f.y > H + 10) f.y = -10;
      }
      const glow = 0.25 + 0.75 * ((Math.sin(t * 0.04 + f.phase) + 1) / 2);
      const gr = f.r * 7;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, gr);
      g.addColorStop(0, `rgba(${COLOR}, ${0.9 * glow})`);
      g.addColorStop(0.25, `rgba(${COLOR}, ${0.3 * glow})`);
      g.addColorStop(1, `rgba(${COLOR}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, gr, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

function createWaves() {
  const { COUNT, SPEED, SWELL, COLOR } = CONFIG.WAVES;

  return (ctx, W, H, t) => {
    const step = W < 600 ? 12 : 8;
    for (let i = 0; i < COUNT; i++) {
      // Kila wimbi lina kasi yake ndogo, na linaelekea upande tofauti
      const speed = SPEED * (1 + i * 0.35) * (i % 2 === 0 ? 1 : -1);
      const amp = 16 + i * 7;
      const freq = 0.005 + i * 0.0012;

      // Kupanda na kushuka taratibu kwa wimbi zima
      const swell = Math.sin(t * Math.abs(speed) * 4 + i * 1.7) * SWELL;
      const baseY = H * (0.6 + i * 0.09) + swell;

      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + step; x += step) {
        const y =
          baseY +
          Math.sin(x * freq + t * speed * 10) * amp +
          Math.sin(x * freq * 2.3 + t * speed * 6) * (amp * 0.35);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = `rgba(${COLOR}, ${0.05 + i * 0.015})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${COLOR}, ${0.22 + i * 0.05})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  };
}

function createStars(w, h) {
  const { COUNT, COLOR, SHOOTING_EVERY } = CONFIG.STARS;
  const scale = clamp((w * h) / (1280 * 720), 0.4, 1.2);
  const stars = Array.from({ length: Math.round(COUNT * scale) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.5, 1.7),
    phase: rand(0, Math.PI * 2),
    tw: rand(0.02, 0.06),
  }));
  let meteors = [];
  let frame = 0;

  return (ctx, W, H, t, animate) => {
    for (const s of stars) {
      const a = 0.25 + 0.75 * ((Math.sin(t * s.tw + s.phase) + 1) / 2);
      ctx.fillStyle = `rgba(${COLOR}, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!animate) return;
    frame++;
    if (frame % SHOOTING_EVERY === 0) {
      meteors.push({
        x: rand(W * 0.2, W),
        y: rand(0, H * 0.4),
        vx: -rand(5, 8),
        vy: rand(2.5, 4),
        life: 0,
        max: 55,
      });
    }
    meteors = meteors.filter((m) => m.life < m.max);
    for (const m of meteors) {
      m.x += m.vx;
      m.y += m.vy;
      m.life++;
      const alpha = 1 - m.life / m.max;
      const tx = m.x - m.vx * 9;
      const ty = m.y - m.vy * 9;
      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `rgba(${COLOR}, ${alpha})`);
      g.addColorStop(1, `rgba(${COLOR}, 0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
  };
}

const STYLE_LAYERS = {
  bubbles: ['bubbles'],
  fireflies: ['fireflies'],
  waves: ['waves'],
  stars: ['stars'],
  mix: ['waves', 'bubbles', 'fireflies'],
};

const LAYER_FACTORIES = {
  bubbles: createBubbles,
  fireflies: createFireflies,
  waves: createWaves,
  stars: createStars,
};

/* ===== Component ya mandharinyuma ===== */
function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let t = 0;
    let rafId = null;
    let layers = [];

    const build = () => {
      const names = STYLE_LAYERS[CONFIG.STYLE] || STYLE_LAYERS.mix;
      layers = names.map((name) => LAYER_FACTORIES[name](w, h));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const layer of layers) layer(ctx, w, h, t, !reduceMotion);
    };

    const loop = () => {
      t += 1;
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion || rafId) return;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const resize = () => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      if (!nw || !nh) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) draw();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    start();
    document.addEventListener('visibilitychange', onVisibility);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    return () => {
      stop();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="login-bg-canvas" aria-hidden="true" />;
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Information Incomplete',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#154734',
      });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data);
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `You have logged in as ${data.fullName}`,
        confirmButtonColor: '#154734',
        timer: 1400,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Login',
        text: err?.response?.data?.message || 'Username or Password is incorrect.',
        confirmButtonColor: '#154734',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Background: mawimbi, mapovu, vimulimuli, nyota */}
      <AnimatedBackground />

      <div className="login-content">
        {/* LEFT: Brand panel */}
        <div className="login-brand-panel">
          <div className="login-brand-overlay" />
          <div className="login-brand-content">
            <div className="login-brand-header">
              <img src="/logo.png" alt="Nembo" className="login-logo" />
              <span className="login-uni-name">ALMADRASATUL MUHAJIRINA</span>
            </div>

            <div className="login-brand-bottom">
              <h1 className="login-brand-heading">
                Almadrasatul <span>Muhajirina</span>
              </h1>
              <p className="login-brand-tagline">Educate minds. Connect families.</p>

              <ul className="login-brand-features">
                <li>
                  <span className="check-icon">✓</span>
                  Manage student information securely
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Track enrollment and academic results
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Generate reports and analytics
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: Form panel */}
        <div className="login-form-panel">
          <div className="login-card">
            <h2 className="login-card-title">Welcome Back</h2>
            <p className="login-sub">Sign in to your administrator dashboard</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field">
                <label htmlFor="username">USERNAME</label>
                <div className="input-with-icon">
                  <span className="input-icon-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                        fill="#fff"
                      />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingiza Username"
                    autoFocus
                    autoComplete="new-username"
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label-row">
                  <label htmlFor="password">PASSWORD</label>
                </div>
                <div className="input-with-icon">
                  <span className="input-icon-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z"
                        fill="#fff"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingiza Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.7M6.5 6.6C4.4 8 2.9 10 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.6"
                          stroke="#9fb3ab"
                          strokeWidth="1.6"
                          fill="none"
                        />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                          stroke="#9fb3ab"
                          strokeWidth="1.6"
                          fill="none"
                        />
                        <circle cx="12" cy="12" r="3" stroke="#9fb3ab" strokeWidth="1.6" fill="none" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Login...' : 'Login'}
              </button>
            </form>

            <p className="login-secure-note">🛡 Your information is secured</p>
          </div>
        </div>
      </div>

      <p className="login-footer">© 2026 Almadrasatul Muhajirina — Registration Management System</p>
    </div>
  );
}