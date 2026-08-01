import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Key,
  Activity,
  Terminal,
  Cpu,
  Lock,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import { ThreatLevel } from '../types';

interface HeaderProps {
  threatLevel: ThreatLevel;
  activeView: string;
  setActiveView: (view: string) => void;
  theme: 'neon-dark' | 'tactical-light';
  setTheme: (t: 'neon-dark' | 'tactical-light') => void;
  audioEnabled: boolean;
  setAudioEnabled: (a: boolean) => void;
  onOpenThreatSim: () => void;
  onRotateKeys: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  threatLevel,
  activeView,
  setActiveView,
  theme,
  setTheme,
  audioEnabled,
  setAudioEnabled,
  onOpenThreatSim,
  onRotateKeys,
}) => {
  const isDark = theme === 'neon-dark';

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity, badge: null },
    { id: 'auth-matrix', label: 'AUTH-MATRIX', icon: Key, badge: 'MFNA' },
    { id: 'cipher-stream', label: 'CIPHER-STREAM', icon: Lock, badge: 'Q-RES' },
    { id: 'sentinel-node', label: 'SENTINEL-NODE', icon: Shield, badge: 'HEURISTIC' },
    { id: 'immutable-ledger', label: 'IMMUTABLE-LEDGER', icon: Terminal, badge: 'SHA-256' },
    { id: 'kaisa-ai', label: 'KAISA AI INTEL', icon: Cpu, badge: 'GEMINI' },
  ];

  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-md ${
        isDark
          ? 'bg-black/90 border-zinc-800 text-white'
          : 'bg-zinc-900/95 border-zinc-700 text-zinc-100'
      }`}
    >
      {/* Top Banner Bar */}
      <div className="px-4 py-2 border-b border-zinc-800 flex flex-wrap justify-between items-center text-xs font-mono gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
            <span className="font-bold tracking-wider text-cyan-400">ETERNIVERSE-SEC-GUARD</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">VERSION: 2.4.1-LTS</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">PROTOCOL: DEV-CORE-7.3-SECURE</span>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-zinc-500">KAISA / MAJSTER-INTEGRATOR</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1.5 border ${
              threatLevel === 'NOMINAL'
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                : threatLevel === 'ELEVATED'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                : 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
            }`}
          >
            {threatLevel === 'NOMINAL' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            ) : threatLevel === 'ELEVATED' ? (
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>
              STATUS:{' '}
              {threatLevel === 'NOMINAL'
                ? 'STABLE'
                : threatLevel === 'ELEVATED'
                ? 'ELEVATED DRIFT'
                : 'CRITICAL BREACH'}
            </span>
          </div>

          {/* Key Rotation Button */}
          <button
            onClick={onRotateKeys}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-700 hover:border-cyan-500/60 rounded text-[11px] font-mono transition flex items-center space-x-1"
            title="Rotate Master Ed25519 Keys"
          >
            <Key className="w-3 h-3 text-cyan-400" />
            <span className="hidden lg:inline">ROTATE KEYS</span>
          </button>

          {/* Threat Simulator Button */}
          <button
            onClick={onOpenThreatSim}
            className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-700/60 hover:border-red-500 rounded text-[11px] font-mono transition flex items-center space-x-1 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          >
            <Zap className="w-3 h-3 text-red-400" />
            <span>SIMULATE THREAT</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1 text-zinc-400 hover:text-cyan-400 transition"
            title={audioEnabled ? 'Mute Alert Sounds' : 'Enable Alert Sounds'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'tactical-light' : 'neon-dark')}
            className="p-1 text-zinc-400 hover:text-cyan-400 transition"
            title="Toggle High Contrast Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-4 py-2 flex space-x-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-2 whitespace-nowrap transition-all ${
                active
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    active ? 'bg-cyan-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
