/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { SecGuard } from './lib/secGuard';
import { LogEntry } from './types';
import { Header } from './components/Header';
import { OverviewCockpit } from './components/Views/OverviewCockpit';
import { AuthMatrixView } from './components/Views/AuthMatrixView';
import { CipherStreamView } from './components/Views/CipherStreamView';
import { SentinelNodeView } from './components/Views/SentinelNodeView';
import { ImmutableLedgerView } from './components/Views/ImmutableLedgerView';
import { KaisaAiIntelView } from './components/Views/KaisaAiIntelView';
import { ThreatSimulatorModal } from './components/ThreatSimulatorModal';
import { playSound } from './lib/soundEffects';

export default function App() {
  const secGuard = SecGuard.getInstance();

  // Reactive state binding to SecGuard singleton
  const stateVersion = useSyncExternalStore(
    (onStoreChange) => secGuard.subscribe(onStoreChange),
    () => secGuard.getVersion()
  );

  const modules = secGuard.getModules();
  const ledger = secGuard.getLedger();
  const metrics = secGuard.getSystemPerformance();
  const threatLevel = secGuard.getOverallThreatLevel();
  const masterKeyFingerprint = secGuard.getCurrentKeyFingerprint();

  // UI state
  const [activeView, setActiveView] = useState<string>('overview');
  const [theme, setTheme] = useState<'neon-dark' | 'tactical-light'>('neon-dark');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isThreatSimOpen, setIsThreatSimOpen] = useState<boolean>(false);
  const [aiSelectedLog, setAiSelectedLog] = useState<LogEntry | null>(null);

  // Background ticker for system call simulation & minor random drift
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random active module to simulate small ambient syscall activity
      const activeMods = modules.filter((m) => m.status === 'ACTIVE');
      if (activeMods.length > 0) {
        const randomMod = activeMods[Math.floor(Math.random() * activeMods.length)];
        secGuard.simulateBehavioralDrift(randomMod.id, (Math.random() - 0.48) * 0.4);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleInitializeShield = async (id: string) => {
    try {
      playSound('SHIELD_ACTIVATE', audioEnabled);
      await secGuard.initializeShield(id, 'CRITICAL');
    } catch (e: any) {
      playSound('ALARM_BREACH', audioEnabled);
    }
  };

  const handleQuarantineModule = (id: string) => {
    playSound('ALARM_BREACH', audioEnabled);
    secGuard.triggerQuarantine(id, 'MANUAL_OPERATOR_LOCKDOWN');
  };

  const handleReleaseQuarantine = (id: string) => {
    playSound('SHIELD_ACTIVATE', audioEnabled);
    secGuard.releaseFromQuarantine(id);
  };

  const handleRotateKeys = () => {
    playSound('KEY_ROTATE', audioEnabled);
    secGuard.rotateKeys();
  };

  const handleRunIntegritySweep = () => {
    playSound('CLICK', audioEnabled);
    modules.forEach((m) => {
      secGuard.performIntegrityCheck(m.id);
    });
    secGuard.addLog(
      'SYSTEM_SWEEP',
      'INFO',
      'INTEGRITY_SWEEP_COMPLETED',
      'All module checksum hashes verified against master KMS.'
    );
  };

  const handleSimulateDrift = (moduleId: string, deltaDrift: number) => {
    playSound('CLICK', audioEnabled);
    secGuard.simulateBehavioralDrift(moduleId, deltaDrift);
  };

  const handleExecuteAttack = (type: string, moduleId: string, description: string) => {
    playSound('ALARM_BREACH', audioEnabled);

    if (type === 'BEHAVIORAL_DRIFT') {
      secGuard.simulateBehavioralDrift(moduleId, 80);
    } else if (type === 'QUANTUM_DECRYPTION') {
      secGuard.simulateBehavioralDrift(moduleId, 65);
      secGuard.addLog(
        moduleId,
        'BREACH',
        'QUANTUM_DECRYPTION_ATTEMPT',
        `Lattice decryption attack detected on ${moduleId}. Auth Tag mismatch.`
      );
    } else if (type === 'ED25519_KEY_TAMPER') {
      secGuard.addLog(
        moduleId,
        'BREACH',
        'ED25519_SIGNATURE_TAMPERING',
        `Signature verification failed for ${moduleId}. Master key fingerprint mismatch.`
      );
      secGuard.triggerQuarantine(moduleId, 'SIGNATURE_TAMPERING_DETECTED');
    } else {
      secGuard.triggerQuarantine(moduleId, `EXPLOIT_TRIGGERED: ${type} - ${description}`);
    }
  };

  const handleOpenAiAnalysis = (log: LogEntry) => {
    setAiSelectedLog(log);
    setActiveView('kaisa-ai');
  };

  const isDark = theme === 'neon-dark';

  return (
    <div
      className={`min-h-screen font-mono relative transition-colors duration-200 ${
        isDark ? 'bg-[#050505] text-zinc-100' : 'bg-zinc-100 text-zinc-900'
      }`}
    >
      {isDark && <div className="scanline" />}
      {/* Top Header & Navigation */}
      <Header
        threatLevel={threatLevel}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        setTheme={setTheme}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenThreatSim={() => setIsThreatSimOpen(true)}
        onRotateKeys={handleRotateKeys}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {activeView === 'overview' && (
          <OverviewCockpit
            modules={modules}
            ledger={ledger}
            metrics={metrics}
            threatLevel={threatLevel}
            masterKeyFingerprint={masterKeyFingerprint}
            theme={theme}
            onInitializeShield={handleInitializeShield}
            onQuarantineModule={handleQuarantineModule}
            onReleaseQuarantine={handleReleaseQuarantine}
            onRotateKeys={handleRotateKeys}
            onRunIntegritySweep={handleRunIntegritySweep}
            onOpenAiAnalysis={handleOpenAiAnalysis}
          />
        )}

        {activeView === 'auth-matrix' && (
          <AuthMatrixView
            theme={theme}
            onRotateKeys={handleRotateKeys}
            masterKeyFingerprint={masterKeyFingerprint}
          />
        )}

        {activeView === 'cipher-stream' && (
          <CipherStreamView
            theme={theme}
            masterKeyFingerprint={masterKeyFingerprint}
            onRotateKeys={handleRotateKeys}
          />
        )}

        {activeView === 'sentinel-node' && (
          <SentinelNodeView
            modules={modules}
            theme={theme}
            onSimulateDrift={handleSimulateDrift}
            onQuarantineModule={handleQuarantineModule}
            onReleaseQuarantine={handleReleaseQuarantine}
            onOpenAiAnalysis={handleOpenAiAnalysis}
          />
        )}

        {activeView === 'immutable-ledger' && (
          <ImmutableLedgerView
            ledger={ledger}
            theme={theme}
            onOpenAiAnalysis={handleOpenAiAnalysis}
          />
        )}

        {activeView === 'kaisa-ai' && (
          <KaisaAiIntelView initialLog={aiSelectedLog} theme={theme} />
        )}
      </main>

      {/* Threat Simulator Modal */}
      <ThreatSimulatorModal
        isOpen={isThreatSimOpen}
        onClose={() => setIsThreatSimOpen(false)}
        onExecuteAttack={handleExecuteAttack}
        modules={modules}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 px-6 text-center text-xs text-zinc-500 font-mono space-y-1">
        <p>
          ETERNIVERSE-SEC-GUARD v2.4.1-LTS | PROTOCOL: DEV-CORE-7.3-SECURE | AUTHOR: KAISA / MAJSTER-INTEGRATOR
        </p>
        <p className="text-[10px] text-zinc-600">
          Zero-Trust Security Core & Cryptographic Isolation Architecture &copy; 2026 ETERNIVERSE
        </p>
      </footer>
    </div>
  );
}
