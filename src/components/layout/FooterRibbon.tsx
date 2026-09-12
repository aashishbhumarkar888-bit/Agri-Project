import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { Wifi, WifiOff, Cpu, RefreshCw, HardDrive } from 'lucide-react';

export const FooterRibbon: React.FC = () => {
  const { isOffline, p2pState, hardware, parity } = useMandiStore();

  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 z-30 h-7 px-3 flex items-center justify-between text-[11px] font-mono select-none transition-colors duration-200 border-t ${
        isOffline 
          ? 'bg-[#F47920] text-slate-900 border-orange-700 font-bold' 
          : 'bg-[#172033] text-slate-300 border-[#203864]'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
        {isOffline ? (
          <div className="flex items-center gap-1.5 text-black">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span className="uppercase tracking-wider">
              OFFLINE FIRST BUFFER: {p2pState.localEventsCount} EVENTS QUEUED IN INDEXEDDB | P2P MESH ACTIVE ({p2pState.peerCount} PEERS)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse"></span>
            <span className="text-white font-medium">
              ESP32 NODE CONNECTED
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              LOCAL LEDGER SYNCED TO APMC CLOUD
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[#52b749]">
              DRIFT SKEW: {parity.skewDriftQtl.toFixed(2)} q
            </span>
          </div>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-4 shrink-0 text-[10px]">
        <span className="flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>QUOTA LEASE: <strong className={isOffline ? 'text-black' : 'text-white'}>{p2pState.localQuotaQtl} q</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span>FIRMWARE: <strong className={isOffline ? 'text-black' : 'text-white'}>{hardware.firmwareVersion}</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-slate-400" />
          <span>LATENCY: <strong className={isOffline ? 'text-black' : 'text-white'}>{hardware.latencyMs}ms</strong></span>
        </span>
      </div>
    </footer>
  );
};
