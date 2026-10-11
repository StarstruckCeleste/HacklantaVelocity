import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const floors = [-1.45, 1.24, 3.93, 6.62];
const mono = (color, options = {}) => new THREE.MeshStandardMaterial({
  color, metalness: 0.3, roughness: 0.66, ...options,
});

function makeTextTexture(text, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, 512, 256);
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `600 ${opts.size ?? 130}px Arial, sans-serif`;
  c.fillStyle = opts.color ?? '#EEEAD7';
  c.shadowColor = opts.shadow ?? '#757D6F';
  c.shadowBlur = 16;
  c.fillText(text, 256, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function box(parent, width, height, depth, mat, x, y, z, options = {}) {
  const geometry = options.round
    ? new RoundedBoxGeometry(width, height, depth, 3, options.round)
    : new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  if (options.rotationX) mesh.rotation.x = options.rotationX;
  if (options.rotationY) mesh.rotation.y = options.rotationY;
  mesh.castShadow = !!options.castShadow;
  mesh.receiveShadow = !!options.receiveShadow;
  parent.add(mesh);
  return mesh;
}

function line(parent, a, b, material) {
  const points = [new THREE.Vector3(...a), new THREE.Vector3(...b)];
  const mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
  parent.add(mesh);
  return mesh;
}

function addCar(parent, x, y, z, color, rotate = 0) {
  const car = new THREE.Group();
  car.position.set(x, y + 0.26, z);
  car.rotation.y = rotate;
  parent.add(car);
  const paint = mono(color, { metalness: 0.67, roughness: 0.33 });
  const glass = mono(0x2D0000, { metalness: 0.6, roughness: 0.13 });
  const tires = mono(0x190B0B, { roughness: 0.95 });
  const rims = mono(0x878C7F, { metalness: 0.9 });
  const lights = new THREE.MeshBasicMaterial({ color: 0xEEEAD7 });
  const rear = new THREE.MeshBasicMaterial({ color: 0x6D0808 });

  box(car, 1.04, 0.42, 2.12, paint, 0, 0.27, 0, { round: 0.15, castShadow: true });
  box(car, 0.88, 0.4, 1.08, glass, 0, 0.65, -0.08, { round: 0.13 });
  box(car, 0.88, 0.065, 0.07, paint, 0, 0.82, -0.62);
  for (const side of [-1, 1]) {
    for (const end of [-0.66, 0.66]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 12), tires);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * 0.55, 0.14, end);
      car.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.123, 12), rims);
      hub.rotation.z = Math.PI / 2;
      hub.position.copy(wheel.position);
      car.add(hub);
    }
    box(car, 0.18, 0.085, 0.03, lights, side * 0.33, 0.35, 1.07);
    box(car, 0.18, 0.075, 0.03, rear, side * 0.33, 0.35, -1.07);
  }
  return car;
}

function makeGarage(scene) {
  const group = new THREE.Group();
  scene.add(group);
  const concrete = mono(0x6A6760, { metalness: 0.14, roughness: 0.92 });
  const concreteEdge = mono(0xA5A898, { metalness: 0.17, roughness: 0.8 });
  const asphalt = mono(0x2E2523, { metalness: 0.25, roughness: 0.91 });
  const trim = mono(0x423530, { metalness: 0.35, roughness: 0.65 });
  const metal = mono(0x93998A, { metalness: 0.85, roughness: 0.34 });
  const whitePaint = new THREE.MeshBasicMaterial({ color: 0xEEEAD7 });
  const accent = new THREE.MeshBasicMaterial({ color: 0x6D0808 });
  const yellowPaint = new THREE.MeshBasicMaterial({ color: 0xEEEAD7 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x757D6F, transparent: true, opacity: 0.38 });
  const glass = mono(0x2D1513, { roughness: 0.16, metalness: 0.76, transparent: true, opacity: 0.7 });

  // Four complete structural levels: slabs, structural columns, barriers and markings.
  floors.forEach((y, i) => {
    box(group, 16.5, 0.34, 12.3, concrete, 0, y, 0, { castShadow: true, receiveShadow: true });
    box(group, 16.32, 0.025, 12.12, asphalt, 0, y + 0.19, 0, { receiveShadow: true });

    // Road edges and luminous architectural trim.
    box(group, 16.6, 0.085, 0.11, concreteEdge, 0, y + 0.18, 6.08);
    box(group, 16.6, 0.085, 0.11, concreteEdge, 0, y + 0.18, -6.08);
    box(group, 16.6, 0.032, 0.055, accent, 0, y - 0.12, 6.16);
    box(group, 0.045, 0.035, 12.2, accent, -8.27, y - 0.12, 0);

    // Painted parking bays. The middle lane is deliberately left clear.
    for (let x = -3.4; x <= 7; x += 2.55) {
      for (const z of [-4.3, 4.3]) {
        box(group, 0.052, 0.013, 2.85, whitePaint, x - 1.12, y + 0.209, z);
      }
    }
    for (let z = -2; z <= 2; z += 2) {
      box(group, 1.0, 0.015, 0.055, yellowPaint, 0.45, y + 0.211, z);
    }

    // Front / rear structural posts and thin safety balustrades.
    if (i < floors.length - 1) {
      for (const x of [-8, -2.25, 3.35, 8]) {
        for (const z of [-5.8, 5.8]) {
          box(group, 0.44, 2.7, 0.48, concreteEdge, x, y + 1.51, z, { castShadow: true });
          box(group, 0.52, 0.05, 0.56, trim, x, y + 0.26, z);
        }
      }
      box(group, 16.1, 0.16, 0.19, trim, 0, y + 2.5, 5.98);
      box(group, 16.1, 0.15, 0.2, concrete, 0, y + 2.5, -5.98);
      for (let x = -7.3; x < 8; x += 1.35) {
        box(group, 0.045, 0.75, 0.05, metal, x, y + 2.14, 6.02);
      }
    } else {
      for (const z of [-5.98, 5.98]) {
        box(group, 16.3, 0.6, 0.20, concrete, 0, y + 0.48, z);
        box(group, 16.3, 0.035, 0.23, accent, 0, y + 0.79, z);
      }
    }

    // Level indicator, fixed to the front fascia, reads correctly head-on.
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.7),
      new THREE.MeshBasicMaterial({ map: makeTextTexture(`0${i + 1}`), transparent: true, depthWrite: false }),
    );
    plaque.position.set(-7.3, y + 0.12, 6.19);
    group.add(plaque);

    // Minimal overhead long LED light strips.
    if (i < floors.length - 1) {
      for (const z of [-3.6, 3.2]) {
        box(group, 3.3, 0.035, 0.13, new THREE.MeshBasicMaterial({ color: 0xEEEAD7 }), 1.35, y + 2.49, z);
      }
    }
  });

  // Exterior framing ties all four visible levels together.
  for (const x of [-8.23, 8.23]) {
    box(group, 0.22, 8.5, 0.26, concreteEdge, x, 2.55, 5.99);
    box(group, 0.22, 8.5, 0.26, concreteEdge, x, 2.55, -5.99);
  }

  // Inclined ramps; alternate direction between levels.
  floors.slice(0, -1).forEach((y, i) => {
    const slope = i % 2 === 0 ? 0.34 : -0.34;
    box(group, 2.7, 0.24, 8.0, asphalt, -6.35, y + 1.54, 0, {
      rotationX: slope, castShadow: true,
    });
    box(group, 0.065, 0.08, 8.0, yellowPaint, -5.13, y + 1.72, 0, { rotationX: slope });
    box(group, 0.10, 0.26, 8, concreteEdge, -7.68, y + 1.57, 0, { rotationX: slope });
  });

  // Assorted low-poly cars, arranged so each one sits cleanly within a marked parking bay.
  const palette = [0x757D6F, 0x9EA295, 0x6D0808, 0xEEEAD7, 0x674A45, 0x2D0000, 0xD4D3C2];
  const slotCenters = [-3.245, -0.695, 1.855, 4.405];
  const occupancy = [
    [true, false, true, true],
    [true, true, false, true],
    [false, true, true, true],
    [true, true, true, false],
  ];
  floors.forEach((y, floorIndex) => {
    slotCenters.forEach((x, idx) => {
      if (!occupancy[floorIndex][idx]) return;
      const z = idx % 2 === 0 ? -4.3 : 4.3;
      addCar(group, x, y, z, palette[(idx + floorIndex * 2) % palette.length], z > 0 ? Math.PI : 0);
    });
  });

  // A distinct luminous spill / hazard, placed on the top parking deck.
  const hazardY = floors[3] + 0.229;
  const points = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 0.62 + 0.18 * Math.sin(i * 2.7 + 1);
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const shape = new THREE.Shape();
  shape.moveTo(...points[0]);
  points.slice(1).forEach(p => shape.lineTo(...p));
  shape.closePath();
  const spill = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color: 0x090909, transparent: true, opacity: 0.88, side: THREE.DoubleSide, depthWrite: false }),
  );
  spill.rotation.x = -Math.PI / 2;
  spill.position.set(3.6, hazardY, 0.15);
  group.add(spill);
  const hazardRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, 0.024, 6, 60),
    new THREE.MeshBasicMaterial({ color: 0x757D6F, transparent: true, opacity: 0.9, depthWrite: false }),
  );
  hazardRing.rotation.x = Math.PI / 2;
  hazardRing.position.set(3.6, hazardY + 0.04, 0.15);
  group.add(hazardRing);

  // Invisible generous click target for user-friendly interaction
  const hitTarget = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.65, 0.9, 18),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitTarget.position.set(3.6, hazardY + 0.45, 0.15);
  group.add(hitTarget);

  // Small security cameras on several corners with subtle scan-volume cones.
  const sensorHeads = [];
  [[-3.2, floors[2] - 0.18, 4.55], [3.0, floors[3] - 0.18, -4.2],
    [6.7, floors[2] - 0.18, 4.9], [-2.3, floors[1] + 2.46, -4.55]].forEach(([x, y, z], i) => {
    box(group, 0.38, 0.12, 0.5, metal, x, y, z);
    const led = box(group, 0.16, 0.12, 0.16, new THREE.MeshBasicMaterial({ color: i % 2 ? 0x6D0808 : 0xEEEAD7 }), x, y - 0.08, z + 0.25);
    sensorHeads.push(led);
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(1.65, 2.3, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x6D0808 : 0x757D6F, transparent: true, opacity: 0.055, side: THREE.DoubleSide, depthWrite: false }),
    );
    cone.position.set(x, y - 1.16, z);
    group.add(cone);
  });

  // Rooftop office / lift core kept minimal so the top deck stays visually clean.
  box(group, 3.0, 2.05, 3.0, concrete, -5.45, 7.88, -3.38, { castShadow: true });
  box(group, 3.2, 0.16, 3.2, concreteEdge, -5.45, 8.94, -3.38);
  box(group, 0.76, 1.05, 1.15, glass, -3.91, 7.85, -3.4);

  // Floating architectural contours (not a flat illustration).
  for (let i = 0; i < 4; i++) {
    line(group, [-8.4, floors[i] - 0.22, 6.27], [8.4, floors[i] - 0.22, 6.27], lineMat);
  }

  // The garage sits above a broad dark platform and atmospheric ring markings.
  const base = new THREE.Mesh(new THREE.CylinderGeometry(12.1, 12.75, 0.52, 80), mono(0x231C19, { metalness: 0.58, roughness: 0.6 }));
  base.position.y = -2.01;
  base.receiveShadow = true;
  group.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(12.1, 0.034, 6, 128), new THREE.MeshBasicMaterial({ color: 0x6D0808, transparent: true, opacity: 0.48 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.74;
  group.add(ring);

  return { group, hazardRing, spill, hitTarget, sensorHeads };
}

function addAtmosphere(scene) {
  const particleCount = 650;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const c1 = new THREE.Color(0x2D0000);
  const c2 = new THREE.Color(0x757D6F);
  const c3 = new THREE.Color(0xEEEAD7);
  for (let i = 0; i < particleCount; i++) {
    const a = i * 2.399963; // golden angle for a non-banded, even distribution
    const radius = 13 + (i % 27) * 0.51;
    positions[i * 3] = Math.cos(a) * radius;
    positions[i * 3 + 1] = -4 + ((i * 31) % 101) / 101 * 17;
    positions[i * 3 + 2] = Math.sin(a) * radius;
    const pick = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
    colors[i * 3] = pick.r;
    colors[i * 3 + 1] = pick.g;
    colors[i * 3 + 2] = pick.b;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(geom, new THREE.PointsMaterial({
    size: 0.065, vertexColors: true, transparent: true, opacity: 0.78, sizeAttenuation: true, depthWrite: false,
  }));
  scene.add(particles);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), mono(0x1C1110, { roughness: 1, metalness: 0 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -2.44;
  plane.receiveShadow = true;
  scene.add(plane);
  const grid = new THREE.GridHelper(130, 60, 0x2D0000, 0x2D1513);
  grid.position.y = -2.432;
  grid.material.transparent = true;
  grid.material.opacity = 0.21;
  scene.add(grid);
  return particles;
}

/** Real Three.js geometry with a frame-rate-independent camera orbit. */
export default function GarageScene({ scrollProgressRef, reducedMotionRef, onSpillClick }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100909);
    scene.fog = new THREE.FogExp2(0x100909, 0.012);
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 220);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.65;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xEEEAD7, 1.65));
    const directional = new THREE.DirectionalLight(0xEEEAD7, 3.05);
    directional.position.set(10, 20, 16);
    directional.castShadow = true;
    directional.shadow.mapSize.set(2048, 2048);
    directional.shadow.camera.left = -17;
    directional.shadow.camera.right = 17;
    directional.shadow.camera.top = 17;
    directional.shadow.camera.bottom = -17;
    directional.shadow.bias = -0.0003;
    scene.add(directional);
    const red = new THREE.PointLight(0x6D0808, 180, 44, 2);
    red.position.set(-12, 5, 4);
    scene.add(red);
    const sage = new THREE.PointLight(0x757D6F, 140, 37, 2);
    sage.position.set(10, 8, -7);
    scene.add(sage);
    const ivory = new THREE.PointLight(0xEEEAD7, 55, 22, 2);
    ivory.position.set(6, 3, 8);
    scene.add(ivory);

    const { group, hazardRing, spill, hitTarget, sensorHeads } = makeGarage(scene);
    const particles = addAtmosphere(scene);
    const clock = new THREE.Clock();
    let smoothedProgress = Math.max(0, Math.min(1, scrollProgressRef.current));
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isVisible = true;

    const raycaster = new THREE.Raycaster();
    const rayMouse = new THREE.Vector2();
    let isHovered = false;
    let downX = 0;
    let downY = 0;

    const checkSpillHit = (clientX, clientY) => {
      rayMouse.x = (clientX / window.innerWidth) * 2 - 1;
      rayMouse.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(rayMouse, camera);
      const hits = raycaster.intersectObjects([hitTarget, spill, hazardRing], true);
      return hits.length > 0;
    };

    const onPointer = (event) => {
      mouseX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      mouseY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;

      if (event.target.closest?.('.incident-modal, .site-header, .chapter-nav, .chapter-content')) {
        if (isHovered) {
          isHovered = false;
          document.body.style.cursor = '';
        }
        return;
      }

      const hit = checkSpillHit(event.clientX, event.clientY);
      if (hit !== isHovered) {
        isHovered = hit;
        document.body.style.cursor = hit ? 'pointer' : '';
      }
    };

    const onPointerDown = (event) => {
      downX = event.clientX;
      downY = event.clientY;
    };

    const onClick = (event) => {
      if (event.target.closest?.('button, a, input, textarea, .incident-modal, .site-header, .chapter-nav, .chapter-content')) {
        return;
      }
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (Math.hypot(dx, dy) > 8) {
        return;
      }

      if (checkSpillHit(event.clientX, event.clientY)) {
        onSpillClick?.();
      }
    };

    const observer = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.fov = w < 700 ? 55 : w < 1020 ? 45 : 39;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 700 ? 1.3 : 1.7));
      renderer.setSize(w, h, false);
    });
    observer.observe(mount);
    const visibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('click', onClick);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!isVisible) return;
      const progress = Math.max(0, Math.min(1, scrollProgressRef.current));
      const factor = 1 - Math.exp(-dt * (reducedMotionRef.current ? 14 : 3.15));
      smoothedProgress += (progress - smoothedProgress) * factor;
      const mobile = mount.clientWidth < 700;
      const angle = 0.65 + smoothedProgress * Math.PI * 2.0;
      const radius = mobile ? 30.5 : 25.2;
      const parallax = reducedMotionRef.current ? 0 : 0.55;
      camera.position.set(
        Math.sin(angle) * radius + mouseX * parallax,
        11.2 + Math.sin(smoothedProgress * Math.PI * 2) * 1.1 - mouseY * parallax,
        Math.cos(angle) * radius,
      );
      const target = new THREE.Vector3(0, mobile ? 3.1 : 2.75, 0);
      camera.lookAt(target);
      if (!reducedMotionRef.current) {
        if (isHovered) {
          hazardRing.scale.setScalar(1.22 + Math.sin(clock.elapsedTime * 6) * 0.08);
          hazardRing.material.opacity = 1.0;
          hazardRing.material.color.setHex(0xEEEAD7);
          spill.material.opacity = 0.98;
        } else {
          hazardRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.3) * 0.095);
          hazardRing.material.opacity = 0.58 + Math.sin(clock.elapsedTime * 2.3) * 0.24;
          hazardRing.material.color.setHex(0x757D6F);
          spill.material.opacity = 0.7 + Math.sin(clock.elapsedTime * 1.4) * 0.11;
        }
        particles.rotation.y += dt * 0.0015;
        sensorHeads.forEach((sensor, i) => {
          sensor.material.opacity = 0.68 + 0.32 * Math.sin(clock.elapsedTime * 1.7 + i);
        });
      }
      renderer.render(scene, camera);
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('click', onClick);
      document.body.style.cursor = '';
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
        materials.forEach((material) => {
          material.map?.dispose?.();
          material.dispose?.();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [scrollProgressRef, reducedMotionRef, onSpillClick]);

  return <div className="three-stage" aria-hidden="true" ref={mountRef} />;
}
