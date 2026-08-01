import React from 'react';
import { Cpu, HardDrive, Radio, Shield, Zap, AlertTriangle, Layers } from 'lucide-react';
import { SystemPerformance } from '../types';

interface SystemMetricsPanelProps {
  metrics: SystemPerformance;
  theme: 'neon-dark' | 'tactical-light';
}

export const SystemMetricsPanel: React.FC<SystemMetricsPanelProps> = ({ metrics, theme }) => {
  const isDark = theme === 'neon-dark';

  const cards = [
    {
      title: 'CPU CORE LOAD',
      value: `${metrics.cpuLoad}%`,
      sub: `${(metrics.cpuLoad * 0.08).toFixed(2)} GHz`,
      icon: Cpu,
      color: metrics.cpuLoad > 75 ? 'text-red-400' : 'text-cyan-400',
      barColor: metrics.cpuLoad > 75 ? 'bg-red-500' : 'bg-cyan-500',
      pct: metrics.cpuLoad,
    },
    {
      title: 'MEMORY ALLOCATION',
      value: `${metrics.memoryUsageMb} MB`,
      sub: '2480 MB Max Reserve',
      icon: HardDrive,
      color: 'text-cyan-400',
      barColor: 'bg-cyan-500',
      pct: Math.min(100, (metrics.memoryUsageMb / 2480) * 100),
    },
    {
      title: 'NETWORK I/O THROUGHPUT',
      value: `${metrics.networkIoKbps} KB/s`,
      sub: 'TLS 1.3 Quantum-Encrypted',
      icon: Radio,
      color: 'text-purple-400',
      barColor: 'bg-purple-500',
      pct: Math.min(100, (metrics.networkIoKbps / 1200) * 100),
    },
    {
      title: 'SYSTEM ENTROPY',
      value: `${metrics.entropyLevel} BITS`,
      sub: 'Hardware KMS Quantum Source',
      icon: Zap,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      pct: 100,
    },
    {
      title: 'ACTIVE WATCHERS',
      value: `${metrics.activeWatchersCount} PROCESSES`,
      sub: 'AbortController Signals',
      icon: Layers,
      color: 'text-cyan-400',
      barColor: 'bg-cyan-500',
      pct: (metrics.activeWatchersCount / 8) * 100,
    },
    {
      title: 'THREAT INDEX GAUGE',
      value: `${metrics.threatScore} / 100`,
      sub: metrics.quarantinedCount > 0 ? `${metrics.quarantinedCount} Quarantined` : 'Zero-Trust Nominal',
      icon: metrics.threatScore > 50 ? AlertTriangle : Shield,
      color: metrics.threatScore > 50 ? 'text-red-400' : 'text-cyan-400',
      barColor: metrics.threatScore > 50 ? 'bg-red-500' : 'bg-cyan-500',
      pct: metrics.threatScore,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-3 rounded border font-mono transition-all ${
              isDark
                ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                : 'bg-white border-zinc-200 shadow-sm hover:border-zinc-300'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase truncate">
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>

            <p className={`text-base font-bold ${card.color} tracking-tight`}>{card.value}</p>
            <p className="text-[10px] text-zinc-500 truncate mb-2">{card.sub}</p>

            <div className="w-full bg-zinc-800/80 h-1 rounded overflow-hidden">
              <div
                className={`h-full ${card.barColor} transition-all duration-300`}
                style={{ width: `${Math.max(4, Math.min(100, card.pct))}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
