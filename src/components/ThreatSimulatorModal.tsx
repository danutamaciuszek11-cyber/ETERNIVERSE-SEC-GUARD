import React, { useState } from 'react';
import { X, Zap, ShieldAlert, Cpu, Lock, AlertTriangle } from 'lucide-react';

interface ThreatSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAttack: (type: string, moduleId: string, description: string) => void;
  modules: { id: string; name: string }[];
}

export const ThreatSimulatorModal: React.FC<ThreatSimulatorModalProps> = ({
  isOpen,
  onClose,
  onExecuteAttack,
  modules,
}) => {
  if (!isOpen) return null;

  const [selectedModule, setSelectedModule] = useState<string>(modules[0]?.id || 'AUTH-MATRIX-01');
  const [attackType, setAttackType] = useState<string>('BEHAVIORAL_DRIFT');
  const [customDescription, setCustomDescription] = useState<string>(
    'Anomalous memory access pattern attempting unauthorized process thread injection.'
  );

  const attacks = [
    {
      id: 'BEHAVIORAL_DRIFT',
      title: 'Behavioral Drift Spike (95%)',
      desc: 'Injects abnormal CPU cycles causing SentinelNode to trigger automatic quarantine.',
      icon: ShieldAlert,
    },
    {
      id: 'QUANTUM_DECRYPTION',
      title: 'Quantum Decryption Probe',
      desc: 'Simulates lattice decryption attempt failing authentication tag check.',
      icon: Lock,
    },
    {
      id: 'ED25519_KEY_TAMPER',
      title: 'Ed25519 Signature Forgery',
      desc: 'Invalidates master key fingerprint signature across AuthMatrix JWTs.',
      icon: Cpu,
    },
    {
      id: 'BUFFER_OVERFLOW',
      title: 'Buffer Overflow sys_ptrace',
      desc: 'Triggers prohibited ptrace memory attachment on core process bus.',
      icon: Zap,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteAttack(attackType, selectedModule, customDescription);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-zinc-950 border border-red-800 shadow-[0_0_25px_rgba(239,68,68,0.4)] rounded-lg p-5 space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wider">
              CYBER THREAT SIMULATOR ENGINE
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Module Selection */}
          <div className="space-y-1">
            <label className="text-zinc-400 block font-bold">Target Module System:</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-2 bg-black border border-zinc-800 text-cyan-400 rounded focus:border-cyan-500 focus:outline-none"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.id}] {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attack Scenario Preset Cards */}
          <div className="space-y-2">
            <label className="text-zinc-400 block font-bold">Select Attack Vector Preset:</label>
            <div className="grid grid-cols-1 gap-2">
              {attacks.map((a) => {
                const Icon = a.icon;
                const isSelected = attackType === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setAttackType(a.id)}
                    className={`p-2.5 border rounded cursor-pointer transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-red-400' : 'text-zinc-500'}`} />
                    <div>
                      <span className="font-bold block text-white">{a.title}</span>
                      <span className="text-[10px] text-zinc-400">{a.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Description */}
          <div className="space-y-1">
            <label className="text-zinc-400 block font-bold">Attack Trace Log Context:</label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full p-2 bg-black border border-zinc-800 text-cyan-300 rounded focus:border-cyan-500 focus:outline-none text-xs"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 font-bold rounded shadow-[0_0_12px_rgba(239,68,68,0.4)] flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>LAUNCH THREAT VECTOR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
