import React from 'react';
import { TokenStatus } from '../../types';

interface StatusBadgeProps {
  status: TokenStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'BOOKED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#E7ECF2] text-[#203864] border border-[#C4C6D0]">
          BOOKED
        </span>
      );
    case 'GATE_CHECKIN':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#203864] text-white">
          GATE CHECK-IN
        </span>
      );
    case 'QUEUED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#F47920] text-white animate-pulse">
          IN QUEUE
        </span>
      );
    case 'WEIGHING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#F47920] text-white">
          ON WEIGHBRIDGE
        </span>
      );
    case 'QUALITY_CHECK':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#203864] text-white">
          QUALITY ASSAY
        </span>
      );
    case 'UNLOADING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#D97706] text-white">
          SILO UNLOADING
        </span>
      );
    case 'PROCUREMENT_COMPLETE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#228B22] text-white">
          PROCURED
        </span>
      );
    case 'PAYMENT_RECONCILIATION':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#203864] text-white">
          PFMS RECONCILING
        </span>
      );
    case 'SETTLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#228B22] text-white">
          DBT SETTLED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};
