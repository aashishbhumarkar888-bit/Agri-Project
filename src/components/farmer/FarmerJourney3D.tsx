import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFarmerStore } from '../../hooks/useFarmerStore';
import { FarmerJourneyStage } from '../../types/farmer';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  RotateCw, 
  Info,
  ChevronRight,
  ShieldCheck,
  Scale,
  CreditCard,
  Truck,
  Sprout
} from 'lucide-react';

interface FarmerJourney3DProps {
  onSelectStage?: (stage: FarmerJourneyStage) => void;
}

export const FarmerJourney3D: React.FC<FarmerJourney3DProps> = ({ onSelectStage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeToken, setSelectedMilestoneModal } = useFarmerStore();

  const [useFallback2D, setUseFallback2D] = useState(false);
  const [activeStage, setActiveStage] = useState<FarmerJourneyStage>('WEIGH');
  const [hoveredStage, setHoveredStage] = useState<FarmerJourneyStage | null>(null);

  // Map activeToken status to current journey stage
  useEffect(() => {
    if (!activeToken) return;
    switch (activeToken.status) {
      case 'BOOKED':
        setActiveStage('SLOT');
        break;
      case 'GATE_CHECKIN':
        setActiveStage('GATE');
        break;
      case 'QUEUED':
        setActiveStage('QUEUE');
        break;
      case 'WEIGHING':
        setActiveStage('WEIGH');
        break;
      case 'QUALITY_CHECK':
        setActiveStage('QUALITY');
        break;
      case 'UNLOADING':
        setActiveStage('UNLOAD');
        break;
      case 'PROCUREMENT_COMPLETE':
        setActiveStage('COMPLETE');
        break;
      case 'PAYMENT_RECONCILIATION':
      case 'SETTLED':
        setActiveStage('PAYMENT');
        break;
      default:
        setActiveStage('CROP');
    }
  }, [activeToken?.status]);

  const stages: { id: FarmerJourneyStage; label: string; desc: string; icon: any }[] = [
    { id: 'REGISTER', label: '1. Profile', desc: 'Registered & Identity', icon: ShieldCheck },
    { id: 'VERIFY', label: '2. KYC', desc: 'Land & Bank Linked', icon: CheckCircle2 },
    { id: 'CROP', label: '3. Crop Ready', desc: 'Wheat Rabi 50 q', icon: Sprout },
    { id: 'SLOT', label: '4. Slot Booked', desc: '10:00–11:00 AM', icon: Layers },
    { id: 'GATE', label: '5. Gate Arrive', desc: 'Token QR Scanned', icon: Truck },
    { id: 'QUEUE', label: '6. Mandi Queue', desc: 'Expected turn 10:20', icon: RotateCw },
    { id: 'WEIGH', label: '7. Weighbridge', desc: '74.25 q Recorded', icon: Scale },
    { id: 'QUALITY', label: '8. Quality Check', desc: 'Moisture 11.2%', icon: Sparkles },
    { id: 'UNLOAD', label: '9. Silo Unload', desc: 'Intake Bay 02', icon: Layers },
    { id: 'PAYMENT', label: '10. DBT Paid', desc: '₹1,68,918 Credited', icon: CreditCard }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === activeStage);

  // Progressive 3D Mounting
  useEffect(() => {
    if (useFallback2D || !containerRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;

    try {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xF1F4F9);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 14, 22);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
      dirLight.position.set(15, 25, 15);
      scene.add(dirLight);

      // Stylized Pathway
      const pathGeo = new THREE.PlaneGeometry(36, 4.5);
      const pathMat = new THREE.MeshStandardMaterial({ 
        color: 0xDEE3EB, 
        roughness: 0.8,
        metalness: 0.1 
      });
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.rotation.x = -Math.PI / 2;
      pathMesh.position.set(0, -0.05, 0);
      scene.add(pathMesh);

      // Connecting guideline
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-15, 0.05, 0),
        new THREE.Vector3(15, 0.05, 0)
      ]);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xF47920,
        dashSize: 0.5,
        gapSize: 0.3
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      lineMesh.computeLineDistances();
      scene.add(lineMesh);

      // 10 Milestone Geometric Nodes
      const nodeMeshes: THREE.Group[] = [];
      const nodeSpacing = 30 / (stages.length - 1);

      stages.forEach((stage, idx) => {
        const xPos = -15 + idx * nodeSpacing;
        const group = new THREE.Group();
        group.position.set(xPos, 0, 0);

        const isPast = idx < currentStageIndex;
        const isCurrent = idx === currentStageIndex;

        // Base Pedestal
        const baseGeo = new THREE.CylinderGeometry(1.0, 1.2, 0.3, 16);
        const baseMat = new THREE.MeshStandardMaterial({
          color: isCurrent ? 0xF47920 : isPast ? 0x228B22 : 0xC4C6D0,
          roughness: 0.4
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.15;
        group.add(base);

        // Milestone Symbolic Object
        let symbolGeo: THREE.BufferGeometry;
        if (stage.id === 'REGISTER' || stage.id === 'VERIFY') {
          // Floating Badge / Ring
          symbolGeo = new THREE.TorusGeometry(0.6, 0.15, 12, 24);
        } else if (stage.id === 'CROP') {
          // Wheat Stalk / Cone
          symbolGeo = new THREE.ConeGeometry(0.6, 1.3, 8);
        } else if (stage.id === 'SLOT' || stage.id === 'GATE') {
          // Calendar Box / Gate Post
          symbolGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        } else if (stage.id === 'WEIGH') {
          // Weighbridge Deck
          symbolGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 6);
        } else {
          // Sphere / Coin
          symbolGeo = new THREE.SphereGeometry(0.65, 16, 16);
        }

        const symbolMat = new THREE.MeshStandardMaterial({
          color: isCurrent ? 0xF47920 : isPast ? 0x228B22 : 0x203864,
          roughness: 0.3,
          metalness: 0.2
        });
        const symbol = new THREE.Mesh(symbolGeo, symbolMat);
        symbol.position.y = 1.3;
        symbol.name = 'symbol';
        group.add(symbol);

        // If Current: Add glowing halo pulse ring
        if (isCurrent) {
          const haloGeo = new THREE.RingGeometry(1.3, 1.6, 32);
          const haloMat = new THREE.MeshBasicMaterial({
            color: 0xF47920,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
          });
          const halo = new THREE.Mesh(haloGeo, haloMat);
          halo.rotation.x = -Math.PI / 2;
          halo.position.y = 0.05;
          halo.name = 'halo';
          group.add(halo);
        }

        scene.add(group);
        nodeMeshes.push(group);
      });

      // Smooth Gentle Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        nodeMeshes.forEach((mesh, idx) => {
          const symbol = mesh.getObjectByName('symbol');
          const halo = mesh.getObjectByName('halo');

          if (symbol) {
            // Very slow, gentle hovering
            symbol.position.y = 1.3 + Math.sin(elapsedTime * 1.5 + idx * 0.4) * 0.1;
            symbol.rotation.y = elapsedTime * 0.4 + idx * 0.2;
          }

          if (halo) {
            const scale = 1 + Math.sin(elapsedTime * 3) * 0.15;
            halo.scale.set(scale, scale, scale);
          }
        });

        renderer?.render(scene, camera);
      };

      animate();

      // Resize Handler
      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animId);
        renderer?.dispose();
      };
    } catch (err) {
      console.warn('WebGL init failed, activating 2D fallback:', err);
      setUseFallback2D(true);
    }
  }, [useFallback2D, currentStageIndex]);

  const handleStageClick = (stageId: FarmerJourneyStage) => {
    setActiveStage(stageId);
    setSelectedMilestoneModal(stageId);
    if (onSelectStage) onSelectStage(stageId);
  };

  const currentStageInfo = stages.find(s => s.id === activeStage) || stages[6];

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3 select-none">
      {/* Visual Metaphor Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2.5">
        <div>
          <div className="text-[10px] font-mono text-[#F47920] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F47920]" />
            <span>MY HARVEST JOURNEY • 10-STAGE CONTINUOUS PATH</span>
          </div>
          <h2 className="text-base font-bold text-[#172033] tracking-tight">
            From Digital Booking to Physical Truth & DBT Payment
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseFallback2D(!useFallback2D)}
            className="px-2.5 py-1 bg-[#F1F4F9] hover:bg-slate-200 text-[#203864] text-[11px] font-mono font-bold rounded border border-[#C4C6D0] transition-all"
            title="Toggle between 3D and 2D view"
          >
            {useFallback2D ? 'SWITCH TO 3D' : 'SWITCH TO 2D'}
          </button>
        </div>
      </div>

      {/* 3D / 2D Canvas Area */}
      <div className="relative h-48 sm:h-56 bg-[#F7F9FC] rounded-[6px] border border-[#E7ECF2] overflow-hidden">
        {!useFallback2D ? (
          <div ref={containerRef} className="w-full h-full cursor-pointer" />
        ) : (
          /* 2D Geometric Visual Fallback */
          <div className="w-full h-full flex items-center justify-between px-3 overflow-x-auto">
            {stages.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const Icon = st.icon;

              return (
                <div key={st.id} className="flex items-center shrink-0">
                  <div
                    onClick={() => handleStageClick(st.id)}
                    className={`flex flex-col items-center p-2 rounded-[8px] cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#203864] text-white shadow-md scale-105 ring-2 ring-[#F47920]'
                        : isPast
                        ? 'bg-green-50 text-[#228B22] border border-green-200'
                        : 'bg-white text-slate-500 border border-[#C4C6D0]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      isCurrent ? 'bg-[#F47920] text-white' : isPast ? 'bg-[#228B22] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold whitespace-nowrap">{st.label}</span>
                    <span className="text-[9px] opacity-80 whitespace-nowrap">{st.desc}</span>
                  </div>

                  {idx < stages.length - 1 && (
                    <div className="w-4 sm:w-6 h-0.5 bg-[#C4C6D0] mx-1 shrink-0 relative">
                      <div className={`h-full ${idx < currentStageIndex ? 'bg-[#228B22]' : 'bg-[#C4C6D0]'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Current Active Floating Overlay Banner */}
        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm border border-[#C4C6D0] rounded-[6px] p-2 flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F47920] animate-pulse" />
            <span className="font-bold text-[#05224D]">
              CURRENT ACTIVE STAGE: <span className="text-[#F47920]">{currentStageInfo.label}</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">• {currentStageInfo.desc}</span>
          </div>

          <button
            onClick={() => setSelectedMilestoneModal(activeStage)}
            className="px-2 py-1 bg-[#203864] text-white font-mono text-[10px] font-bold rounded flex items-center gap-1 hover:bg-[#172033]"
          >
            <Info className="w-3 h-3" />
            <span>EXPLAIN WHAT'S NEXT</span>
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Step Buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
        {stages.map((st, idx) => {
          const isPast = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <button
              key={st.id}
              onClick={() => handleStageClick(st.id)}
              className={`p-1.5 rounded text-center transition-all border ${
                isCurrent
                  ? 'bg-[#203864] text-white border-[#F47920] shadow-sm font-bold'
                  : isPast
                  ? 'bg-green-50 text-[#228B22] border-green-200 font-semibold'
                  : 'bg-white text-slate-600 border-[#E7ECF2] hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] truncate">{st.label.split('.')[1] || st.label}</div>
              <div className="text-[9px] text-slate-400 font-mono">
                {isPast ? '✓' : isCurrent ? '●' : '○'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
