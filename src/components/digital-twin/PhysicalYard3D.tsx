import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMandiStore } from '../../hooks/useMandiStore';
import { Isometric2DFallback } from './Isometric2DFallback';
import { Eye, RefreshCw, ZoomIn, ZoomOut, Layers, ShieldCheck, Box } from 'lucide-react';

interface Props {
  onSelectVehicle: (id: string) => void;
  selectedVehicleId: string | null;
}

export const PhysicalYard3D: React.FC<Props> = ({ onSelectVehicle, selectedVehicleId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tokens, hardware, parity } = useMandiStore();
  const [webGlFailed, setWebGlFailed] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);
  const [cameraView, setCameraView] = useState<'isometric' | 'weighbridge' | 'silos'>('isometric');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vehicleMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const reqAnimIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xedf2f7);
      scene.fog = new THREE.FogExp2(0xedf2f7, 0.015);
      sceneRef.current = scene;

      // Camera: Isometric perspective
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 500;
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
      camera.position.set(45, 38, 55);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer with antialiasing
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      containerRef.current.appendChild(renderer.domElement);

      // Lighting - Crisp engineering lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(30, 50, 40);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 150;
      dirLight.shadow.camera.left = -40;
      dirLight.shadow.camera.right = 40;
      dirLight.shadow.camera.top = 40;
      dirLight.shadow.camera.bottom = -40;
      scene.add(dirLight);

      // Yard Ground (Asphalt Platform)
      const groundGeo = new THREE.PlaneGeometry(90, 70);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0xd9e0e8,
        roughness: 0.85,
        metalness: 0.1,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Grid Lines & Markings (Industrial precision)
      const grid = new THREE.GridHelper(80, 40, 0x203864, 0xc4c6d0);
      grid.position.y = 0.02;
      scene.add(grid);

      // --- PHYSICAL STRUCTURES ---

      // 1. Physical Gate Structure (x = -32)
      const gateGroup = new THREE.Group();
      gateGroup.position.set(-32, 0, 0);

      // Gate pillars
      const pillarGeo = new THREE.BoxGeometry(1.2, 4.5, 1.2);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x203864, metalness: 0.4 });
      const p1 = new THREE.Mesh(pillarGeo, pillarMat);
      p1.position.set(0, 2.25, -7);
      const p2 = new THREE.Mesh(pillarGeo, pillarMat);
      p2.position.set(0, 2.25, 7);
      gateGroup.add(p1, p2);

      // Gate overhead beam
      const beamGeo = new THREE.BoxGeometry(1.2, 0.8, 15);
      const beam = new THREE.Mesh(beamGeo, pillarMat);
      beam.position.set(0, 4.5, 0);
      gateGroup.add(beam);

      // Barrier arm (Orange/White stripes)
      const barrierGeo = new THREE.CylinderGeometry(0.12, 0.12, 12);
      const barrierMat = new THREE.MeshStandardMaterial({ color: 0xf47920 });
      const barrier = new THREE.Mesh(barrierGeo, barrierMat);
      barrier.rotation.x = Math.PI / 2;
      barrier.position.set(0.5, 1.2, 0);
      gateGroup.add(barrier);
      scene.add(gateGroup);

      // 2. WDRR Lanes Markings (-20 to -5)
      // Normal Lane (Q1 - Blue accent)
      const lane1Geo = new THREE.PlaneGeometry(24, 3.8);
      const lane1Mat = new THREE.MeshStandardMaterial({ color: 0xc8d3e0 });
      const l1 = new THREE.Mesh(lane1Geo, lane1Mat);
      l1.rotation.x = -Math.PI / 2;
      l1.position.set(-15, 0.03, -4.5);
      scene.add(l1);

      // Exception Lane (Q2 - Orange accent for heavy trailer)
      const lane2Geo = new THREE.PlaneGeometry(24, 4.2);
      const lane2Mat = new THREE.MeshStandardMaterial({ color: 0xbcc9d8 });
      const l2 = new THREE.Mesh(lane2Geo, lane2Mat);
      l2.rotation.x = -Math.PI / 2;
      l2.position.set(-15, 0.03, 0);
      scene.add(l2);

      // Assisted Lane (Q3 - Green accent)
      const lane3Geo = new THREE.PlaneGeometry(24, 3.8);
      const lane3Mat = new THREE.MeshStandardMaterial({ color: 0xc8d3e0 });
      const l3 = new THREE.Mesh(lane3Geo, lane3Mat);
      l3.rotation.x = -Math.PI / 2;
      l3.position.set(-15, 0.03, 4.5);
      scene.add(l3);

      // 3. ESP32 Weighbridge Platform (x = 3 to 15, z = 0)
      const wbGroup = new THREE.Group();
      wbGroup.position.set(6, 0, 0);

      // Steel pit foundation
      const wbPitGeo = new THREE.BoxGeometry(14, 0.4, 6);
      const wbPitMat = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.9 });
      const wbPit = new THREE.Mesh(wbPitGeo, wbPitMat);
      wbPit.position.y = 0.2;
      wbPit.receiveShadow = true;
      wbGroup.add(wbPit);

      // Floating weigh plate (Yellow/Steel textured)
      const plateGeo = new THREE.BoxGeometry(13.2, 0.2, 5.2);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x3b465c, metalness: 0.6, roughness: 0.3 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = 0.4;
      plate.castShadow = true;
      plate.receiveShadow = true;
      wbGroup.add(plate);

      // 4 Load Cell posts at corners
      const loadCellGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5);
      const loadCellMat = new THREE.MeshStandardMaterial({ color: 0x228b22, emissive: 0x114411 });
      const lcOffsets = [
        [-6, -2.2],
        [6, -2.2],
        [-6, 2.2],
        [6, 2.2],
      ];
      lcOffsets.forEach(([lx, lz]) => {
        const lc = new THREE.Mesh(loadCellGeo, loadCellMat);
        lc.position.set(lx, 0.25, lz);
        wbGroup.add(lc);
      });

      // Weighbridge Hardware Cabin (ESP32 Terminal)
      const cabinGeo = new THREE.BoxGeometry(3, 3, 2.5);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x203864 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.5, -4.5);
      cabin.castShadow = true;
      wbGroup.add(cabin);

      // Cabin roof
      const cRoofGeo = new THREE.BoxGeometry(3.4, 0.3, 2.9);
      const cRoofMat = new THREE.MeshStandardMaterial({ color: 0x05224d });
      const cRoof = new THREE.Mesh(cRoofGeo, cRoofMat);
      cRoof.position.set(0, 3.1, -4.5);
      wbGroup.add(cRoof);

      // Antenna / Telemetry Mast with green pulsing beacon
      const mastGeo = new THREE.CylinderGeometry(0.06, 0.06, 3);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x747780 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(1.2, 4.5, -4.5);
      wbGroup.add(mast);

      const beaconGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const beaconMat = new THREE.MeshStandardMaterial({ color: 0x228b22, emissive: 0x228b22 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(1.2, 6.1, -4.5);
      wbGroup.add(beacon);
      scene.add(wbGroup);

      // 4. Quality Inspection Booth (x = 18, z = -6)
      const qbGroup = new THREE.Group();
      qbGroup.position.set(18, 0, -5);
      const qbGeo = new THREE.BoxGeometry(3.5, 3.2, 3);
      const qbMat = new THREE.MeshStandardMaterial({ color: 0xe7ecf2, metalness: 0.1 });
      const qb = new THREE.Mesh(qbGeo, qbMat);
      qb.position.y = 1.6;
      qb.castShadow = true;
      qbGroup.add(qb);
      scene.add(qbGroup);

      // 5. Silo Complex & Unloading Bay (x = 28 to 36)
      const siloGroup = new THREE.Group();
      siloGroup.position.set(28, 0, 0);

      // Silo 1 (Alpha - Wheat)
      const silo1BodyGeo = new THREE.CylinderGeometry(3.8, 3.8, 12, 24);
      const siloMat = new THREE.MeshStandardMaterial({ color: 0xd9e2fc, metalness: 0.3, roughness: 0.4 });
      const silo1 = new THREE.Mesh(silo1BodyGeo, siloMat);
      silo1.position.set(0, 6, -6);
      silo1.castShadow = true;
      siloGroup.add(silo1);

      const coneGeo = new THREE.ConeGeometry(3.8, 3, 24);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0x203864 });
      const cone1 = new THREE.Mesh(coneGeo, coneMat);
      cone1.position.set(0, 13.5, -6);
      cone1.castShadow = true;
      siloGroup.add(cone1);

      // Silo 2 (Beta - Soybean)
      const silo2 = new THREE.Mesh(silo1BodyGeo, siloMat);
      silo2.position.set(0, 6, 6);
      silo2.castShadow = true;
      siloGroup.add(silo2);

      const cone2 = new THREE.Mesh(coneGeo, coneMat);
      cone2.position.set(0, 13.5, 6);
      cone2.castShadow = true;
      siloGroup.add(cone2);

      // Unloading Hopper Bay in between
      const hopperGeo = new THREE.BoxGeometry(6, 4, 5);
      const hopperMat = new THREE.MeshStandardMaterial({ color: 0x44474f });
      const hopper = new THREE.Mesh(hopperGeo, hopperMat);
      hopper.position.set(0, 2, 0);
      hopper.castShadow = true;
      siloGroup.add(hopper);
      scene.add(siloGroup);

      // --- VEHICLES CREATION ---
      const vehicleMap = new Map<string, THREE.Group>();

      // Vehicle 1: Ramesh Patel's Tractor (On Weighbridge at x = 6, z = 0)
      const tractorGroup = createTractorMesh();
      tractorGroup.position.set(6, 0.4, 0);
      tractorGroup.name = 'CG-WHT-2841';
      scene.add(tractorGroup);
      vehicleMap.set('CG-WHT-2841', tractorGroup);

      // Vehicle 2: Baldev Singh's Semi-Trailer (In Q2 Exception lane at x = -14, z = 0)
      const semiGroup = createSemiTrailerMesh();
      semiGroup.position.set(-14, 0.05, 0);
      semiGroup.name = 'CG-SOY-2842';
      scene.add(semiGroup);
      vehicleMap.set('CG-SOY-2842', semiGroup);

      // Vehicle 3: Kamla Bai's Small Commercial (In Q3 Assisted lane at x = -20, z = 4.5)
      const pickupGroup = createPickupMesh();
      pickupGroup.position.set(-20, 0.05, 4.5);
      pickupGroup.name = 'CG-WHT-2843';
      scene.add(pickupGroup);
      vehicleMap.set('CG-WHT-2843', pickupGroup);

      vehicleMeshesRef.current = vehicleMap;

      // Click Raycaster for selecting vehicles
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handlePointerDown = (event: MouseEvent) => {
        if (!containerRef.current || !cameraRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (const hit of intersects) {
          let obj: THREE.Object3D | null = hit.object;
          while (obj && obj !== scene) {
            if (obj.name && obj.name.startsWith('CG-')) {
              onSelectVehicle(obj.name);
              return;
            }
            obj = obj.parent;
          }
        }
      };

      const domElem = renderer.domElement;
      domElem.addEventListener('pointerdown', handlePointerDown);

      // Simple mouse drag orbit interaction
      let isDragging = false;
      let prevMouseX = 0;
      let prevMouseY = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !cameraRef.current) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        // Orbit around center
        const radius = Math.sqrt(
          cameraRef.current.position.x ** 2 + cameraRef.current.position.z ** 2
        );
        let angle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
        angle -= deltaX * 0.006;
        cameraRef.current.position.x = radius * Math.cos(angle);
        cameraRef.current.position.z = radius * Math.sin(angle);
        cameraRef.current.position.y = Math.max(15, Math.min(65, cameraRef.current.position.y - deltaY * 0.15));
        cameraRef.current.lookAt(0, 2, 0);
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      domElem.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        reqAnimIdRef.current = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Pulsing telemetry beacon
        if (beacon) {
          beacon.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.15);
        }

        // Highlight selected vehicle
        vehicleMap.forEach((mesh, id) => {
          const isSelected = id === selectedVehicleId;
          const highlightRing = mesh.getObjectByName('highlight_ring');
          if (highlightRing) {
            highlightRing.visible = isSelected;
            if (isSelected) {
              highlightRing.rotation.z += 0.02;
            }
          }
        });

        renderer.render(scene, camera);
      };

      animate();
      setIs3DReady(true);

      // Handle Resize
      const resizeObserver = new ResizeObserver(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        const newW = containerRef.current.clientWidth;
        const newH = containerRef.current.clientHeight;
        cameraRef.current.aspect = newW / newH;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        if (reqAnimIdRef.current) cancelAnimationFrame(reqAnimIdRef.current);
        domElem.removeEventListener('pointerdown', handlePointerDown);
        domElem.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        resizeObserver.disconnect();
        renderer.dispose();
        if (domElem.parentElement) {
          domElem.parentElement.removeChild(domElem);
        }
      };
    } catch (err) {
      console.warn('WebGL Initialization failed, falling back to 2D:', err);
      setWebGlFailed(true);
    }
  }, [selectedVehicleId, onSelectVehicle]);

  // Camera presets
  const handleSetPreset = (preset: 'isometric' | 'weighbridge' | 'silos') => {
    setCameraView(preset);
    if (!cameraRef.current) return;
    if (preset === 'isometric') {
      cameraRef.current.position.set(45, 38, 55);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (preset === 'weighbridge') {
      cameraRef.current.position.set(16, 12, 18);
      cameraRef.current.lookAt(6, 1, 0);
    } else if (preset === 'silos') {
      cameraRef.current.position.set(40, 20, 25);
      cameraRef.current.lookAt(28, 6, 0);
    }
  };

  if (webGlFailed) {
    return <Isometric2DFallback onSelectVehicle={onSelectVehicle} selectedVehicleId={selectedVehicleId} />;
  }

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#E7ECF2] border border-[#C4C6D0] rounded-[6px] overflow-hidden">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Controls Overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <div className="bg-[#05224D]/90 backdrop-blur text-white px-2.5 py-1 rounded-[4px] border border-white/10 font-mono text-[11px] flex items-center gap-2 pointer-events-auto shadow">
          <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse"></span>
          <span className="font-bold">PHYSICAL YARD 3D LOGISTICS TWIN</span>
          <span className="text-slate-400">|</span>
          <span className="text-[#F47920]">BHOPAL YARD 04</span>
        </div>

        {/* Camera Views Preset Pills */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur p-1 rounded-[4px] border border-[#C4C6D0] shadow pointer-events-auto text-[10px] font-mono font-medium">
          <button
            onClick={() => handleSetPreset('isometric')}
            className={`px-2 py-0.5 rounded transition-all ${cameraView === 'isometric' ? 'bg-[#203864] text-white font-bold' : 'text-[#172033] hover:bg-slate-100'}`}
          >
            ISOMETRIC
          </button>
          <button
            onClick={() => handleSetPreset('weighbridge')}
            className={`px-2 py-0.5 rounded transition-all ${cameraView === 'weighbridge' ? 'bg-[#203864] text-white font-bold' : 'text-[#172033] hover:bg-slate-100'}`}
          >
            WEIGHBRIDGE
          </button>
          <button
            onClick={() => handleSetPreset('silos')}
            className={`px-2 py-0.5 rounded transition-all ${cameraView === 'silos' ? 'bg-[#203864] text-white font-bold' : 'text-[#172033] hover:bg-slate-100'}`}
          >
            SILOS
          </button>
          <button
            onClick={() => setWebGlFailed(true)}
            className="px-1.5 py-0.5 rounded text-[#44474F] hover:text-[#DC2626] hover:bg-red-50 ml-1"
            title="Switch to 2D Fallback"
          >
            2D MODE
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Floating Pill */}
      <div className="absolute bottom-2 left-2 bg-[#172033]/90 text-white px-2.5 py-1 rounded-[4px] border border-white/10 font-mono text-[10px] flex items-center gap-3 pointer-events-auto">
        <span>INTERACTIVE: Drag to rotate view • Click vehicle to inspect</span>
        <span className="text-[#77dd6a] font-bold">
          LIVE WB LOAD: {hardware.grossWeightQtl} q
        </span>
      </div>
    </div>
  );
};

// --- Low-poly 3D Models Helpers ---

function createTractorMesh(): THREE.Group {
  const group = new THREE.Group();

  // Tractor Engine / Hood (Dark Green)
  const hoodGeo = new THREE.BoxGeometry(2.2, 1.4, 1.4);
  const hoodMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.4 });
  const hood = new THREE.Mesh(hoodGeo, hoodMat);
  hood.position.set(1.1, 0.9, 0);
  hood.castShadow = true;
  group.add(hood);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(1.4, 1.8, 1.4);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.5, 1.5, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Big rear wheels
  const wheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.9 });
  const rw1 = new THREE.Mesh(wheelGeo, wheelMat);
  rw1.rotation.x = Math.PI / 2;
  rw1.position.set(-0.5, 0.75, 0.9);
  const rw2 = new THREE.Mesh(wheelGeo, wheelMat);
  rw2.rotation.x = Math.PI / 2;
  rw2.position.set(-0.5, 0.75, -0.9);
  group.add(rw1, rw2);

  // Front smaller wheels
  const fWheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 16);
  const fw1 = new THREE.Mesh(fWheelGeo, wheelMat);
  fw1.rotation.x = Math.PI / 2;
  fw1.position.set(1.7, 0.45, 0.8);
  const fw2 = new THREE.Mesh(fWheelGeo, wheelMat);
  fw2.rotation.x = Math.PI / 2;
  fw2.position.set(1.7, 0.45, -0.8);
  group.add(fw1, fw2);

  // Trailer hitched behind
  const trailerGeo = new THREE.BoxGeometry(4.2, 1.5, 2.2);
  const trailerMat = new THREE.MeshStandardMaterial({ color: 0x203864, metalness: 0.3 });
  const trailer = new THREE.Mesh(trailerGeo, trailerMat);
  trailer.position.set(-3.8, 1.1, 0);
  trailer.castShadow = true;
  group.add(trailer);

  // Grain Payload in trailer (Golden Wheat color)
  const grainGeo = new THREE.BoxGeometry(4.0, 0.6, 2.0);
  const grainMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.9 });
  const grain = new THREE.Mesh(grainGeo, grainMat);
  grain.position.set(-3.8, 1.9, 0);
  group.add(grain);

  // Trailer wheels
  const tw1 = new THREE.Mesh(wheelGeo, wheelMat);
  tw1.rotation.x = Math.PI / 2;
  tw1.position.set(-3.8, 0.75, 1.25);
  const tw2 = new THREE.Mesh(wheelGeo, wheelMat);
  tw2.rotation.x = Math.PI / 2;
  tw2.position.set(-3.8, 0.75, -1.25);
  group.add(tw1, tw2);

  // Selection Highlight Ring (hidden by default)
  const ringGeo = new THREE.RingGeometry(2.5, 2.7, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf47920, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  ring.name = 'highlight_ring';
  ring.visible = false;
  group.add(ring);

  return group;
}

function createSemiTrailerMesh(): THREE.Group {
  const group = new THREE.Group();

  // Heavy Truck Cabin (Deep Blue)
  const cabinGeo = new THREE.BoxGeometry(2.6, 2.8, 2.2);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x05224d });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(4, 1.7, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Long 3-axle Semi Trailer (White/Grey with SIH Orange stripe)
  const semiGeo = new THREE.BoxGeometry(9.5, 2.8, 2.4);
  const semiMat = new THREE.MeshStandardMaterial({ color: 0xf1f3ff, roughness: 0.3 });
  const semi = new THREE.Mesh(semiGeo, semiMat);
  semi.position.set(-2, 1.9, 0);
  semi.castShadow = true;
  group.add(semi);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x172033 });
  [-5.5, -4.0, -2.5, 3.2, 4.5].forEach(wx => {
    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.rotation.x = Math.PI / 2;
    w1.position.set(wx, 0.65, 1.3);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.rotation.x = Math.PI / 2;
    w2.position.set(wx, 0.65, -1.3);
    group.add(w1, w2);
  });

  // Highlight Ring
  const ringGeo = new THREE.RingGeometry(4.8, 5.1, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf47920, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  ring.name = 'highlight_ring';
  ring.visible = false;
  group.add(ring);

  return group;
}

function createPickupMesh(): THREE.Group {
  const group = new THREE.Group();

  // Small pickup carrier
  const cabGeo = new THREE.BoxGeometry(1.8, 1.6, 1.5);
  const cabMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const cab = new THREE.Mesh(cabGeo, cabMat);
  cab.position.set(1.2, 1.1, 0);
  group.add(cab);

  const bedGeo = new THREE.BoxGeometry(2.4, 1.0, 1.5);
  const bedMat = new THREE.MeshStandardMaterial({ color: 0x44474f });
  const bed = new THREE.Mesh(bedGeo, bedMat);
  bed.position.set(-0.8, 0.8, 0);
  group.add(bed);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 14);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x172033 });
  [-1.2, 1.2].forEach(wx => {
    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.rotation.x = Math.PI / 2;
    w1.position.set(wx, 0.4, 0.85);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.rotation.x = Math.PI / 2;
    w2.position.set(wx, 0.4, -0.85);
    group.add(w1, w2);
  });

  // Highlight Ring
  const ringGeo = new THREE.RingGeometry(2.0, 2.2, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf47920, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  ring.name = 'highlight_ring';
  ring.visible = false;
  group.add(ring);

  return group;
}
