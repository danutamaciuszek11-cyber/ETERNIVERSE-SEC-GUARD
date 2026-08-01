import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, AlertTriangle, RefreshCw, Flame, Eye, Lock, Zap } from 'lucide-react';
import { ModuleShieldInfo, LogEntry } from '../../types';
import { SecGuard } from '../../lib/secGuard';

interface SentinelNodeViewProps {
  modules: ModuleShieldInfo[];
  theme: 'neon-dark' | 'tactical-light';
  onSimulateDrift: (moduleId: string, deltaDrift: number) => void;
  onQuarantineModule: (moduleId: string) => void;
  onReleaseQuarantine: (moduleId: string) => void;
  onOpenAiAnalysis: (log: LogEntry) => void;
}

interface SyscallTrace {
  id: string;
  timestamp: string;
  moduleId: string;
  syscall: string;
  args: string;
  status: 'ALLOWED' | 'SUSPICIOUS' | 'BLOCKED';
}

export const SentinelNodeView: React.FC<SentinelNodeViewProps> = ({
  modules,
  theme,
  onSimulateDrift,
  onQuarantineModule,
  onReleaseQuarantine,
  onOpenAiAnalysis,
}) => {
  const isDark = theme === 'neon-dark';
  const secGuard = SecGuard.getInstance();

  const [traces, setTraces] = useState<SyscallTrace[]>([]);
  const [selectedModuleForTrace, setSelectedModuleForTrace] = useState<string>('AUTH-MATRIX-01');

  // Simulated live system call stream
  useEffect(() => {
    const syscallsList = [
      { call: 'sys_read', args: 'fd=4, buf=0x7ffe92, count=1024' },
      { call: 'sys_write', args: 'fd=1, buf=0x8f10ab, count=256' },
      { call: 'sys_mmap', args: 'addr=NULL, len=4096, prot=PROT_READ|PROT_EXEC' },
      { call: 'sys_socket', args: 'domain=AF_INET, type=SOCK_STREAM, proto=IPPROTO_TLS' },
      { call: 'sys_ptrace', args: 'request=PTRACE_ATTACH, pid=1402' },
      { call: 'sys_epoll_wait', args: 'epfd=3, events=0x992a, maxevents=64' },
    ];

    const interval = setInterval(() => {
      const randomMod = modules[Math.floor(Math.random() * modules.length)];
      if (!randomMod) return;

      const randomCall = syscallsList[Math.floor(Math.random() * syscallsList.length)];
      const isSuspicious =
        randomCall.call === 'sys_ptrace' || randomMod.driftPercentage > 40;
      const isBlocked = randomMod.status === 'QUARANTINED';

      const trace: SyscallTrace = {
        id: `SYS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        moduleId: randomMod.id,
        syscall: randomCall.call,
        args: randomCall.args,
        status: isBlocked ? 'BLOCKED' : isSuspicious ? 'SUSPICIOUS' : 'ALLOWED',
      };

      setTraces((prev) => [trace, ...prev.slice(0, 24)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [modules]);

  const quarantinedModules = modules.filter((m) => m.status === 'QUARANTINED');

  return (
    <div className="space-y-6 font-mono">
      {/* Title Header */}
      <div className={`p-4 border rounded flex flex-wrap justify-between items-center ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-950/80 text-red-400 border border-red-500/50 rounded shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              SentinelNode :: THREAT & BEHAVIORAL DRIFT INSPECTOR
            </h2>
            <p className="text-xs text-zinc-500">
              Heuristic system call analysis, automatic process quarantine & zero-trust isolation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-zinc-500">QUARANTINE VAULT:</span>
          <span
            className={`px-2 py-1 rounded font-bold ${
              quarantinedModules.length > 0
                ? 'bg-red-500 text-black animate-pulse'
                : 'bg-zinc-900 text-cyan-400 border border-zinc-700'
            }`}
          >
            {quarantinedModules.length} PROCESSES ISOLATED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Drift Simulator Controls */}
        <div className={`lg:col-span-2 p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>MODULE DRIFT & HEURISTIC CONTROL GRID</span>
            </h3>
            <span className="text-xs text-zinc-500">AUTOMATIC QUARANTINE @ 85%</span>
          </div>

          <div className="space-y-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className={`p-3 border rounded text-xs space-y-2 transition ${
                  m.status === 'QUARANTINED'
                    ? 'bg-red-950/30 border-red-800'
                    : m.driftPercentage > 50
                    ? 'bg-amber-950/20 border-amber-800'
                    : 'bg-zinc-900/70 border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white tracking-wide">{m.name}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">[{m.id}]</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      m.status === 'QUARANTINED'
                        ? 'bg-red-500 text-black'
                        : m.status === 'DEGRADED'
                        ? 'bg-amber-500 text-black'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* Interactive Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Heuristic Drift Meter:</span>
                    <span
                      className={`font-bold ${
                        m.driftPercentage >= 85
                          ? 'text-red-400'
                          : m.driftPercentage > 40
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {m.driftPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={m.driftPercentage}
                    onChange={(e) =>
                      onSimulateDrift(m.id, parseFloat(e.target.value) - m.driftPercentage)
                    }
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Quick actions */}
                <div className="flex justify-between items-center pt-1 text-[10px]">
                  <span className="text-zinc-500">Syscalls: {m.syscallCount} | CPU: {m.cpuUsage}%</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onSimulateDrift(m.id, 25)}
                      className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded hover:bg-amber-900"
                    >
                      +25% DRIFT
                    </button>
                    {m.status === 'QUARANTINED' ? (
                      <button
                        onClick={() => onReleaseQuarantine(m.id)}
                        className="px-2 py-0.5 bg-cyan-900 text-cyan-200 border border-cyan-500 rounded font-bold"
                      >
                        RESTORE
                      </button>
                    ) : (
                      <button
                        onClick={() => onQuarantineModule(m.id)}
                        className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded hover:bg-red-900 font-bold"
                      >
                        QUARANTINE NOW
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Call Trace Stream */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>LIVE SYSTEM CALL INSPECTOR</span>
            </h3>
            <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {traces.map((t) => (
              <div
                key={t.id}
                className={`p-2 rounded border text-[10px] font-mono space-y-1 transition ${
                  t.status === 'BLOCKED'
                    ? 'bg-red-950/50 border-red-800 text-red-300'
                    : t.status === 'SUSPICIOUS'
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-cyan-400">{t.syscall}</span>
                  <span
                    className={`px-1 rounded text-[9px] font-bold ${
                      t.status === 'BLOCKED'
                        ? 'bg-red-500 text-black'
                        : t.status === 'SUSPICIOUS'
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-zinc-400 truncate">{t.args}</p>
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>Mod: {t.moduleId}</span>
                  <span>{t.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
