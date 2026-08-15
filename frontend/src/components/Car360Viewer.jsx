import React, { useRef, useState, useEffect, useCallback } from 'react';
import { colors, spacing, radius, typography } from '../styles/designTokens';
import Car3DModel from './Car3DModel';

/**
 * Interactive 360° studio turntable. Since we only have one photo per car,
 * the stage simulates a rotating turntable: the floor disc spins, a light
 * sweep travels across the bodywork and the image sways in 3D.
 *  - drag to rotate (with inertia fling on release)
 *  - scroll / +/- buttons to zoom
 *  - double-click to toggle auto-spin · arrow keys rotate
 */
export default function Car360Viewer({ image, alt, modelSrc }) {
  const [angle, setAngle] = useState(0);
  const [autoSpin, setAutoSpin] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const angleRef = useRef(0);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const stageRef = useRef(null);

  const rotateBy = useCallback((deg) => {
    angleRef.current = ((angleRef.current + deg) % 360 + 360) % 360;
    setAngle(angleRef.current);
  }, []);

  // Auto-spin, driven by requestAnimationFrame with delta-time (~12°/s)
  useEffect(() => {
    if (!autoSpin) return undefined;
    let raf;
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(48, t - last);
      last = t;
      rotateBy(dt * 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, rotateBy]);

  // Wheel zoom — native listener so preventDefault works (non-passive)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(1, Math.round((z + (e.deltaY < 0 ? 0.15 : -0.15)) * 100) / 100)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Arrow keys rotate the car (skips inputs)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      e.preventDefault();
      setAutoSpin(false);
      rotateBy(e.key === 'ArrowRight' ? 5 : -5);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rotateBy]);

  const stopInertia = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    stopInertia();
    dragRef.current = { startX: e.clientX, startAngle: angleRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, id: e.pointerId };
    setAutoSpin(false);
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
    angleRef.current = ((d.startAngle + (e.clientX - d.startX) * 0.35) % 360 + 360) % 360;
    setAngle(angleRef.current);
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    // Fling: decay the last pointer velocity to a stop
    if (Math.abs(d.v) > 0.15) {
      let v = d.v * 0.5;
      const step = () => {
        angleRef.current = ((angleRef.current + v) % 360 + 360) % 360;
        setAngle(angleRef.current);
        v *= 0.96;
        if (Math.abs(v) < 0.02) return;
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const rad = (angle * Math.PI) / 180;
  const sway = Math.sin(rad) * 12;
  const tilt = Math.cos(rad) * 4;

  return (
    <div style={{ width: '100%' }}>
      {/* Stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onDoubleClick={() => setAutoSpin((a) => !a)}
        style={{
          position: 'relative',
          height: 380,
          overflow: 'hidden',
          borderRadius: radius.lg,
          background: '#000',
          border: `1px solid ${colors.border}`,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {modelSrc ? (
          <Car3DModel angle={angle} zoom={zoom} modelSrc={modelSrc} fallbackImage={image} fallbackAlt={alt} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1100 }}>
            <div style={{ transform: `rotateY(${sway}deg) rotateX(${tilt}deg) scale(${zoom})`, transition: 'transform 0.08s linear', width: '76%', maxWidth: 560 }}>
              <img src={image} alt={alt} draggable={false} style={{ width: '100%', display: 'block', borderRadius: 10 }} />
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {['+', '−'].map((op) => (
            <button
              key={op}
              onClick={() => setZoom((z) => Math.min(2, Math.max(1, Math.round((z + (op === '+' ? 0.2 : -0.2)) * 100) / 100)))}
              aria-label={op === '+' ? 'Zoom in' : 'Zoom out'}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                background: 'rgba(5,5,7,0.6)',
                border: `1px solid ${colors.border2}`,
                color: colors.white70,
                fontSize: 16,
                lineHeight: 1,
                cursor: 'none',
              }}
            >{op}</button>
          ))}
          <span style={{
            fontFamily: typography.fontUI,
            fontSize: 9,
            letterSpacing: '1px',
            color: colors.white40,
          }}>
            ×{zoom.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setAutoSpin((a) => !a)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            background: autoSpin ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${autoSpin ? 'rgba(201,168,76,0.5)' : colors.border2}`,
            borderRadius: radius.sm,
            color: autoSpin ? '#c9a84c' : colors.white70,
            fontFamily: typography.fontUI,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'none',
          }}
        >
          {autoSpin ? '❚❚ Pause' : '▶ Auto-Spin'}
        </button>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Drag to rotate', 'Scroll to zoom', 'Double-click to spin'].map((hint) => (
            <span
              key={hint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                borderRadius: radius.full,
                border: `1px solid ${colors.border2}`,
                background: 'rgba(255,255,255,0.03)',
                fontFamily: typography.fontUI,
                fontSize: 9.5,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: colors.white45,
              }}
            >
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', opacity: 0.8 }} />
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
