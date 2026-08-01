import React, { useState } from 'react';
import { Lock, Unlock, Key, Zap, Shield, Copy, Check, ShieldAlert } from 'lucide-react';
import { CipherPayload } from '../../types';
import { CryptoCore } from '../../lib/secGuard';

interface CipherStreamViewProps {
  theme: 'neon-dark' | 'tactical-light';
  masterKeyFingerprint: string;
  onRotateKeys: () => void;
}

export const CipherStreamView: React.FC<CipherStreamViewProps> = ({
  theme,
  masterKeyFingerprint,
  onRotateKeys,
}) => {
  const isDark = theme === 'neon-dark';
  const [plaintextInput, setPlaintextInput] = useState<string>(
    'ETERNIVERSE-SEC-GUARD: Core sovereign data payload #8492'
  );
  const [useQuantumWrapper, setUseQuantumWrapper] = useState<boolean>(true);
  const [payloads, setPayloads] = useState<CipherPayload[]>(() => [
    CryptoCore.encrypt('ETERNIVERSE System Core Configuration', true),
    CryptoCore.encrypt('Neural Auth Private Key Database', true),
  ]);

  const [activePayload, setActivePayload] = useState<CipherPayload | null>(payloads[0]);
  const [decryptionResult, setDecryptionResult] = useState<{
    success: boolean;
    result: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEncrypt = () => {
    if (!plaintextInput.trim()) return;
    const newPayload = CryptoCore.encrypt(plaintextInput, useQuantumWrapper);
    setPayloads((prev) => [newPayload, ...prev]);
    setActivePayload(newPayload);
    setDecryptionResult(null);
  };

  const handleDecrypt = (payload: CipherPayload) => {
    setActivePayload(payload);
    const res = CryptoCore.decrypt(payload);
    setDecryptionResult(res);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Title Header */}
      <div className={`p-4 border rounded flex flex-wrap justify-between items-center ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-950/80 text-purple-400 border border-purple-500/50 rounded">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              CipherStream :: CRYPTOGRAPHIC ENCRYPTION ENGINE
            </h2>
            <p className="text-xs text-zinc-500">
              AES-256-GCM data-at-rest encryption, TLS 1.3 Quantum-Resistant Wrappers & Hardware KMS key management.
            </p>
          </div>
        </div>

        <button
          onClick={onRotateKeys}
          className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-500 text-purple-300 font-bold text-xs rounded shadow-[0_0_10px_rgba(168,85,247,0.3)] transition flex items-center space-x-2"
        >
          <Key className="w-3.5 h-3.5 text-purple-400" />
          <span>ROTATE MASTER KMS KEYS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encrypt & Decrypt Interactive Sandbox */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>LIVE ENCRYPTION / DECRYPTION SANDBOX</span>
            </h3>
            <span className="text-xs text-zinc-500">AES-256-GCM</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Input Data */}
            <div>
              <label className="text-zinc-400 block mb-1">Plaintext Input Payload:</label>
              <textarea
                value={plaintextInput}
                onChange={(e) => setPlaintextInput(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-black border border-zinc-800 text-cyan-300 focus:border-cyan-500 focus:outline-none rounded font-mono text-xs"
                placeholder="Enter plaintext to encrypt..."
              ></textarea>
            </div>

            {/* Algorithm options */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Quantum-Resistant Wrapper</span>
                <span className="text-[11px] text-zinc-500">
                  Lattice-based post-quantum cryptographic header encapsulation
                </span>
              </div>
              <button
                onClick={() => setUseQuantumWrapper(!useQuantumWrapper)}
                className={`px-3 py-1 rounded font-bold transition ${
                  useQuantumWrapper
                    ? 'bg-purple-500 text-black shadow-[0_0_10px_#a855f7]'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {useQuantumWrapper ? 'ENABLED' : 'STANDARD'}
              </button>
            </div>

            {/* Action button */}
            <button
              onClick={handleEncrypt}
              className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 border border-purple-500 text-purple-200 font-bold rounded shadow-[0_0_12px_rgba(168,85,247,0.4)] transition flex justify-center items-center space-x-2"
            >
              <Lock className="w-4 h-4 text-purple-400" />
              <span>ENCRYPT PAYLOAD WITH AES-256-GCM</span>
            </button>

            {/* Ciphertext Output */}
            {activePayload && (
              <div className="p-3 bg-black border border-zinc-800 rounded space-y-2 mt-4">
                <div className="flex justify-between items-center text-[11px] border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500 font-bold">{activePayload.id}</span>
                  <span className="text-purple-400">{activePayload.algorithm}</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Ciphertext Payload:</span>
                    <div className="p-2 bg-zinc-900 text-purple-300 rounded break-all border border-zinc-800 flex justify-between items-start">
                      <span className="font-mono">{activePayload.ciphertext}</span>
                      <button
                        onClick={() => handleCopy(activePayload.ciphertext, activePayload.id)}
                        className="text-zinc-500 hover:text-cyan-400 ml-2"
                      >
                        {copiedId === activePayload.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-1">
                    <div>
                      <span className="text-zinc-500">IV (Nonce):</span>{' '}
                      <span className="text-cyan-400">{activePayload.iv}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Auth Tag:</span>{' '}
                      <span className="text-emerald-400">{activePayload.authTag}</span>
                    </div>
                  </div>
                </div>

                {/* Decrypt button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleDecrypt(activePayload)}
                    className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/60 text-cyan-400 font-bold text-xs rounded transition flex items-center justify-center space-x-2"
                  >
                    <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TEST DECRYPTION & AUTH TAG</span>
                  </button>

                  {decryptionResult && (
                    <div
                      className={`mt-2 p-2 rounded border text-[11px] ${
                        decryptionResult.success
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-red-950/40 border-red-800 text-red-300'
                      }`}
                    >
                      <span className="font-bold block mb-0.5">
                        {decryptionResult.success
                          ? 'DECRYPTION SUCCESSFUL (AUTH TAG VERIFIED)'
                          : 'DECRYPTION BREACH'}
                      </span>
                      <p className="text-zinc-200 font-mono">{decryptionResult.result}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KMS Key Vault & Encrypted Record History */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>HARDWARE KMS & CIPHER VAULT</span>
            </h3>
            <span className="text-xs text-zinc-500">512-BIT ENTROPY</span>
          </div>

          <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 font-bold">MASTER KMS KEY FINGERPRINT</span>
              <span className="text-cyan-400 font-bold">{masterKeyFingerprint}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 text-[11px]">
              <span>Hardware Security Module (HSM):</span>
              <span className="text-emerald-400 font-bold">ONLINE (TAMPER-PROOF)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 text-[11px]">
              <span>Key Rotation Protocol:</span>
              <span className="text-zinc-300">Ed25519 Asymmetric Automatic</span>
            </div>
          </div>

          {/* Stored Payloads List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider">
              ENCRYPTED PAYLOAD LEDGER ({payloads.length})
            </h4>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {payloads.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleDecrypt(p)}
                  className={`p-3 border rounded cursor-pointer transition ${
                    activePayload?.id === p.id
                      ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-white">{p.id}</span>
                    <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                      {p.algorithm.includes('Quantum') ? 'Q-RES' : 'AES-256'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 truncate font-mono">{p.plaintext}</p>
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                    <span>Key: {p.keyFingerprint}</span>
                    <span>{new Date(p.encryptedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
