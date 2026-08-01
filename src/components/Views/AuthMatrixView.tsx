import React, { useState } from 'react';
import { Key, ShieldCheck, UserCheck, Lock, RefreshCw, Cpu, Check, X } from 'lucide-react';
import { AuthToken } from '../../types';
import { CryptoCore } from '../../lib/secGuard';

interface AuthMatrixViewProps {
  theme: 'neon-dark' | 'tactical-light';
  onRotateKeys: () => void;
  masterKeyFingerprint: string;
}

export const AuthMatrixView: React.FC<AuthMatrixViewProps> = ({
  theme,
  onRotateKeys,
  masterKeyFingerprint,
}) => {
  const isDark = theme === 'neon-dark';
  const [selectedRole, setSelectedRole] = useState<AuthToken['role']>('SUPER_ADMIN');
  const [mfnaActive, setMfnaActive] = useState<boolean>(true);
  const [currentToken, setCurrentToken] = useState<AuthToken>(() =>
    CryptoCore.generateJwtToken('SUPER_ADMIN', true)
  );
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);

  // Dynamic RBAC Permission Table State
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({
    CORE_PROCESS_ISOLATE: true,
    CIPHER_MASTER_ROTATE: true,
    SENTINEL_QUARANTINE_OVERRIDE: true,
    IMMUTABLE_LEDGER_READ: true,
    NEURAL_MFNA_BYPASS: false,
    EMERGENCY_SHUTDOWN: true,
  });

  const handleGenerateToken = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      const token = CryptoCore.generateJwtToken(selectedRole, mfnaActive);
      setCurrentToken(token);
      setBiometricScanning(false);
    }, 600);
  };

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Title Header */}
      <div className={`p-4 border rounded flex flex-wrap justify-between items-center ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/80 text-cyan-400 border border-cyan-500/50 rounded">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              AuthMatrix :: IDENTITY & NEURAL AUTHENTICATION LAYER
            </h2>
            <p className="text-xs text-zinc-500">
              Multi-Factor Neural Authentication (MFNA), Dynamic Ed25519 asymmetric JWT tokens & Zero-Trust RBAC permissions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-zinc-500">MASTER SIGNING KEY:</span>
          <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-cyan-400 font-bold rounded">
            {masterKeyFingerprint}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Multi-Factor Neural Authentication (MFNA) & JWT Generator */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>MFNA NEURAL TOKEN GENERATOR</span>
            </h3>
            <span className="text-xs text-zinc-500">Ed25519 ASYMMETRIC</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-zinc-400 block">Select Operator Role (RBAC):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['SUPER_ADMIN', 'SECURITY_OPERATOR', 'CYBER_AUDITOR', 'GUEST'] as const).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`py-1.5 px-2 rounded border transition text-center ${
                        selectedRole === r
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* MFNA Neural Biometric Toggle */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Multi-Factor Neural Auth (MFNA)</span>
                <span className="text-[11px] text-zinc-500">
                  Real-time neural biometric pattern verification
                </span>
              </div>

              <button
                onClick={() => setMfnaActive(!mfnaActive)}
                className={`px-3 py-1 rounded font-bold transition ${
                  mfnaActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_#06b6d4]'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {mfnaActive ? 'ACTIVE (98.4% MATCH)' : 'BYPASSED'}
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateToken}
              disabled={biometricScanning}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 font-bold rounded shadow-[0_0_12px_rgba(6,182,212,0.4)] transition flex justify-center items-center space-x-2"
            >
              {biometricScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>SCANNING NEURAL SYNAPSE...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>GENERATE SIGNED JWT TOKEN</span>
                </>
              )}
            </button>

            {/* Token Inspector */}
            <div className="p-3 bg-black border border-zinc-800 rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] text-zinc-500 border-b border-zinc-900 pb-1">
                <span>ACTIVE TOKEN PAYLOAD</span>
                <span className="text-cyan-400 font-bold">{currentToken.tokenId}</span>
              </div>

              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subject / User ID:</span>
                  <span className="text-white font-bold">{currentToken.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Role:</span>
                  <span className="text-purple-400 font-bold">{currentToken.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">MFNA Score:</span>
                  <span className={currentToken.mfnaVerified ? 'text-emerald-400' : 'text-red-400'}>
                    {currentToken.neuralScore}% Verified
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Key Fingerprint:</span>
                  <span className="text-cyan-400">{currentToken.keyFingerprint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Issued / Expires:</span>
                  <span className="text-zinc-300">
                    {currentToken.issuedAt} / {currentToken.expiresAt}
                  </span>
                </div>
              </div>

              {/* Signature Display */}
              <div className="pt-2 border-t border-zinc-900 text-[10px]">
                <span className="text-zinc-500 block mb-0.5">Ed25519 Asymmetric Signature:</span>
                <p className="p-1.5 bg-zinc-900/90 text-zinc-400 rounded break-all border border-zinc-800/80">
                  {currentToken.signature}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: RBAC Matrix & Master Permission Grid */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>RBAC PERMISSIONS MATRIX ({selectedRole})</span>
            </h3>
            <button
              onClick={onRotateKeys}
              className="px-2 py-0.5 bg-purple-950 border border-purple-600 text-purple-300 text-[10px] rounded hover:bg-purple-900 transition"
            >
              ROTATE ED25519 KEYS
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Configure granular access capabilities for <span className="text-cyan-400 font-bold">{selectedRole}</span>. Changes apply dynamically across the ETERNIVERSE core bus.
          </p>

          <div className="space-y-2">
            {Object.entries(permissions).map(([permKey, isEnabled]) => (
              <div
                key={permKey}
                className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{permKey}</span>
                  <span className="text-[10px] text-zinc-500">
                    {permKey.includes('ISOLATE')
                      ? 'Allows process termination and watcher hooks'
                      : permKey.includes('ROTATE')
                      ? 'Grants access to master KMS key rotation'
                      : permKey.includes('QUARANTINE')
                      ? 'Override automated SentinelNode lockdowns'
                      : 'Standard security capability'}
                  </span>
                </div>

                <button
                  onClick={() => togglePermission(permKey)}
                  className={`px-3 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition ${
                    isEnabled
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-500'
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>GRANTED</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-zinc-500" />
                      <span>DENIED</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded flex items-center space-x-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <p className="text-zinc-400 text-[11px]">
              All AuthMatrix tokens are validated against the hardware KMS before process execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
