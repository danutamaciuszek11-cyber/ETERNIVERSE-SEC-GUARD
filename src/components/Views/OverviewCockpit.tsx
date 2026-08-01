import React from 'react';
import {
  ModuleShieldInfo,
  LogEntry,
  SystemPerformance,
  ThreatLevel,
} from '../../types';
import { StatusCard } from '../StatusCard';
import { SystemMetricsPanel } from '../SystemMetricsPanel';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  RefreshCw,
  Key,
  Flame,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
} from 'lucide-react';

interface OverviewCockpitProps {
  modules: ModuleShieldInfo[];
  ledger: LogEntry[];
  metrics: SystemPerformance;
  threatLevel: ThreatLevel;
  masterKeyFingerprint: string;
  theme: 'neon-dark' | 'tactical-light';
  onInitializeShield: (id: string) => void;
  onQuarantineModule: (id: string) => void;
  onReleaseQuarantine: (id: string) => void;
  onRotateKeys: () => void;
  onRunIntegritySweep: () => void;
  onOpenAiAnalysis: (log: LogEntry) => void;
}

export const OverviewCockpit: React.FC<OverviewCockpitProps> = ({
  modules,
  ledger,
  metrics,
  threatLevel,
  masterKeyFingerprint,
  theme,
  onInitializeShield,
  onQuarantineModule,
  onReleaseQuarantine,
  onRotateKeys,
  onRunIntegritySweep,
  onOpenAiAnalysis,
}) => {
  const isDark = theme === 'neon-dark';

  return (
    <div className="space-y-6 font-mono">
      {/* Top Grid: Atomic Status Card & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Molecule SEC-STATUS-CARD */}
        <div className="lg:col-span-1">
          <StatusCard
            threatLevel={threatLevel}
            activeWatchersCount={metrics.activeWatchersCount}
            quarantinedCount={metrics.quarantinedCount}
            algorithm="AES-256-GCM"
            masterKeyFingerprint={masterKeyFingerprint}
          />
        </div>

        {/* Tactical Defense Quick Controls */}
        <div
          className={`lg:col-span-2 p-4 border rounded flex flex-col justify-between ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>COMMAND & DEFENSE CONTROL CENTER</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Execute real-time process isolation, cryptographic rotation, and shield reinforcement.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              ZERO-TRUST V2.4.1
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={onRunIntegritySweep}
              className="p-2.5 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/50 hover:border-cyan-400 rounded text-xs text-cyan-300 font-bold flex flex-col items-center space-y-1 transition text-center"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>INTEGRITY SWEEP</span>
            </button>

            <button
              onClick={onRotateKeys}
              className="p-2.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/50 hover:border-purple-400 rounded text-xs text-purple-300 font-bold flex flex-col items-center space-y-1 transition text-center"
            >
              <Key className="w-4 h-4 text-purple-400" />
              <span>ROTATE MASTER KEYS</span>
            </button>

            <button
              onClick={() => modules.forEach((m) => onInitializeShield(m.id))}
              className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/50 hover:border-emerald-400 rounded text-xs text-emerald-300 font-bold flex flex-col items-center space-y-1 transition text-center"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ENGAGE ALL SHIELDS</span>
            </button>

            <button
              onClick={() =>
                modules.forEach((m) => {
                  if (m.status === 'QUARANTINED') onReleaseQuarantine(m.id);
                })
              }
              className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 hover:border-amber-400 rounded text-xs text-amber-300 font-bold flex flex-col items-center space-y-1 transition text-center"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>PURGE QUARANTINE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Bar */}
      <div>
        <h3 className="text-xs text-zinc-400 font-bold mb-2 tracking-widest flex items-center space-x-2">
          <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></span>
          <span>REAL-TIME SYSTEM PERFORMANCE MONITORING</span>
        </h3>
        <SystemMetricsPanel metrics={metrics} theme={theme} />
      </div>

      {/* Modules Matrix & Active Watchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Module Shield Status Grid */}
        <div
          className={`lg:col-span-2 p-4 border rounded space-y-4 ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>PROTECTED SYSTEM MODULES ({modules.length})</span>
            </h3>
            <span className="text-xs text-zinc-500">
              Active Watchers: {metrics.activeWatchersCount} / {modules.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules.map((mod) => {
              const isQuarantined = mod.status === 'QUARANTINED';
              const isDegraded = mod.status === 'DEGRADED';

              return (
                <div
                  key={mod.id}
                  className={`p-3 border rounded transition-all ${
                    isQuarantined
                      ? 'bg-red-950/30 border-red-800/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                      : isDegraded
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : isDark
                      ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-widest block">
                        [{mod.category}] {mod.id}
                      </span>
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">
                        {mod.name}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isQuarantined
                          ? 'bg-red-500 text-black animate-pulse'
                          : isDegraded
                          ? 'bg-amber-500 text-black'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>

                  {/* Hash & Security Level */}
                  <div className="text-[10px] text-zinc-400 space-y-1 mb-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Integrity Hash:</span>
                      <span className="text-zinc-300 font-mono truncate max-w-[140px]">
                        {mod.integrityHash}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Sec Level:</span>
                      <span
                        className={
                          mod.securityLevel === 'CRITICAL' ? 'text-purple-400 font-bold' : 'text-zinc-300'
                        }
                      >
                        {mod.securityLevel}
                      </span>
                    </div>
                  </div>

                  {/* Behavioral Drift Progress */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Behavioral Drift:</span>
                      <span
                        className={`font-bold ${
                          mod.driftPercentage > 50
                            ? 'text-red-400'
                            : mod.driftPercentage > 20
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {mod.driftPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          mod.driftPercentage > 50
                            ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                            : mod.driftPercentage > 20
                            ? 'bg-amber-500'
                            : 'bg-cyan-500 shadow-[0_0_6px_#06b6d4]'
                        }`}
                        style={{ width: `${Math.max(2, mod.driftPercentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-1 border-t border-zinc-800">
                    {isQuarantined ? (
                      <button
                        onClick={() => onReleaseQuarantine(mod.id)}
                        className="w-full py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-[10px] font-bold rounded border border-cyan-500/60 transition"
                      >
                        RESTORE SHIELD
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onInitializeShield(mod.id)}
                          className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-[10px] rounded border border-zinc-700 transition"
                        >
                          RE-ENGAGE SHIELD
                        </button>
                        <button
                          onClick={() => onQuarantineModule(mod.id)}
                          className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 text-[10px] rounded border border-red-800/60 transition"
                          title="Isolate in Quarantine"
                        >
                          QUARANTINE
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Immutable Event Ledger Panel */}
        <div
          className={`p-4 border rounded flex flex-col justify-between ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>LIVE IMMUTABLE LEDGER STREAM</span>
            </h3>
            <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {ledger.slice(0, 15).map((log) => {
              const isBreach = log.level === 'BREACH' || log.level === 'QUARANTINE';
              const isWarn = log.level === 'WARN';

              return (
                <div
                  key={log.id}
                  className={`p-2.5 rounded border text-[11px] font-mono space-y-1 transition ${
                    isBreach
                      ? 'bg-red-950/40 border-red-800 text-red-300'
                      : isWarn
                      ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span className="font-bold tracking-wider">{log.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isBreach
                          ? 'bg-red-500 text-black'
                          : isWarn
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-800 text-cyan-400'
                      }`}
                    >
                      {log.level}
                    </span>
                  </div>

                  <p className="font-bold tracking-wide text-white truncate">{log.event}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-2">{log.details}</p>

                  <div className="flex justify-between items-center text-[9px] text-zinc-600 pt-1 border-t border-zinc-800/80">
                    <span className="truncate max-w-[150px]">HASH: {log.hash}</span>
                    <button
                      onClick={() => onOpenAiAnalysis(log)}
                      className="text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <Search className="w-2.5 h-2.5" />
                      <span>KAISA AI</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
