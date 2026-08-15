import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { typography } from '../styles/designTokens';

/**
 * Renders a .glb car model inside the studio stage using plain Three.js.
 * Rotation (angle) and zoom are driven by the parent, so the CSS floor /
 * reflection / light sweep stay in sync. Falls back to the 2D image when
 * WebGL is unavailable or the model fails to load.
 */
export default function Car3DModel({ angle = 0, zoom = 1, modelSrc, fallbackImage, fallbackAlt }) {
  const containerRef = useRef(null);
  const angleRef = useRef(angle);
  const zoomRef = useRef(zoom);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [webglOk] = useState(() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  });

  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  useEffect(() => {
    if (!webglOk) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus('error');
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.7, 3.2);
    camera.lookAt(0, 0.4, 0);

    // No direct lights — the car is lit only by the studio environment
    // reflection, so it pops against a pure black background.

    const group = new THREE.Group();
    scene.add(group);

    const draco = new DRACOLoader();
    draco.setDecoderPath(`${modelSrc.slice(0, modelSrc.lastIndexOf('/'))}/draco/`);

    let cancelled = false;
    let disposed = false;
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      draco.dispose();
      pmrem.dispose();
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m && m.dispose());
        }
      });
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load(
      modelSrc,
      (gltf) => {
        if (cancelled || disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2.2 / maxDim : 1;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        model.traverse((o) => {
          if (o.isMesh) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m) => {
              if (m && 'envMapIntensity' in m) m.envMapIntensity = 1.4;
            });
          }
        });
        group.add(model);
        setStatus('ready');
      },
      undefined,
      () => {
        if (!cancelled && !disposed) {
          setStatus('error');
          dispose();
        }
      }
    );

    let raf;
    const loop = () => {
      group.rotation.y = THREE.MathUtils.degToRad(-angleRef.current);
      group.scale.setScalar(zoomRef.current);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return dispose;
  }, [webglOk, modelSrc]);

  const showFallback = !webglOk || status === 'error';
  const rad = (angle * Math.PI) / 180;
  const sway = Math.sin(rad) * 18;
  const tilt = Math.cos(rad) * 5;

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <style>{`@keyframes car3d-spin { to { transform: rotate(360deg); } }`}</style>

      {showFallback && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1100 }}>
          <div style={{ transform: `rotateY(${sway}deg) rotateX(${tilt}deg) scale(${zoom})`, transition: 'transform 0.08s linear', width: '76%', maxWidth: 560 }}>
            <img
              src={fallbackImage}
              alt={fallbackAlt}
              draggable={false}
              style={{ width: '100%', display: 'block', borderRadius: 10, border: '1px solid rgba(201,168,76,0.35)' }}
            />
          </div>
        </div>
      )}

      {webglOk && status === 'loading' && !showFallback && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '2px solid rgba(201,168,76,0.2)',
            borderTopColor: '#c9a84c',
            animation: 'car3d-spin 0.9s linear infinite',
          }} />
          <span style={{ fontFamily: typography.fontUI, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)' }}>
            Loading 3D model…
          </span>
        </div>
      )}
    </div>
  );
}
