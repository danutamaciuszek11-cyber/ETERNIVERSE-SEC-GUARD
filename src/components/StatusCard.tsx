import React from 'react';
import { ThreatLevel } from '../types';

interface StatusCardProps {
  threatLevel: ThreatLevel;
  activeWatchersCount: number;
  quarantinedCount: number;
  algorithm: string;
  masterKeyFingerprint: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  threatLevel,
  activeWatchersCount,
  quarantinedCount,
  algorithm,
  masterKeyFingerprint,
}) => {
  const isNominal = threatLevel === 'NOMINAL';
  const isElevated = threatLevel === 'ELEVATED';

  const borderColor = isNominal
    ? 'border-cyan-500'
    : isElevated
    ? 'border-amber-500'
    : 'border-red-500';

  const shadowColor = isNominal
    ? 'shadow-[0_0_15px_rgba(6,182,212,0.5)]'
    : isElevated
    ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]'
    : 'shadow-[0_0_20px_rgba(239,68,68,0.7)]';

  const pulseColor = isNominal
    ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
    : isElevated
    ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
    : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping';

  const progressWidth = isNominal ? '98%' : isElevated ? '72%' : '34%';
  const progressBg = isNominal ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : isElevated ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_10px_#ef4444]';

  return (
    <div className={`bg-black border-l-4 ${borderColor} p-4 ${shadowColor} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">
          System Security Status
        </span>
        <div className={`h-2 w-2 ${pulseColor} rounded-full`}></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-2 border border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-mono">Firewall</p>
          <p className="text-white font-bold font-mono text-sm flex items-center justify-between">
            <span>{quarantinedCount > 0 ? 'ISOLATING' : 'ACTIVE'}</span>
            <span className="text-[10px] text-cyan-400 font-normal">[{activeWatchersCount} WTC]</span>
          </p>
        </div>
        <div className="bg-zinc-900 p-2 border border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-mono">Encryption</p>
          <p className="text-white font-bold font-mono text-sm truncate" title={algorithm}>
            {algorithm}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
        <span>MASTER KEY: {masterKeyFingerprint}</span>
        <span>INTEGRITY: {progressWidth}</span>
      </div>
      <div className="w-full bg-zinc-800 h-1">
        <div
          className={`${progressBg} h-1 transition-all duration-500`}
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  );
};
