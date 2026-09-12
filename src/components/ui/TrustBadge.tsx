import React from 'react';
import { TrustTier } from '../../types';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface TrustBadgeProps {
  tier: TrustTier;
  showSignature?: boolean;
  signature?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  tier,
  showSignature = false,
  signature = '0x8f7a...c491',
  size = 'md'
}) => {
  if (tier === 'TIER_1_ATTESTED') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#228B22] text-white font-mono text-xs font-semibold tracking-wide border border-[#196b19]`}>
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>TIER 1 ATTESTED</span>
        {showSignature && (
          <span className="ml-1 opacity-80 text-[10px] bg-black/20 px-1 py-0.2 rounded">
            ECDSA:{signature}
          </span>
        )}
      </div>
    );
  }

  if (tier === 'TIER_2_OBSERVED') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#203864]/10 text-[#203864] font-mono text-xs font-semibold tracking-wide border border-[#203864]/30`}>
        <Cpu className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#F47920]" />
        <span>TIER 2 OBSERVED</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#D97706]/15 text-[#D97706] font-mono text-xs font-bold tracking-wide border border-[#D97706] border-dashed`}>
      <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#D97706]" />
      <span>TIER 3 MANUAL FALLBACK</span>
    </div>
  );
};
