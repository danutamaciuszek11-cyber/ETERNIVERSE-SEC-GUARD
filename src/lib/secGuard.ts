// MODULE: ETERNIVERSE-SEC-GUARD-CORE | VERSION: 2.4.1-LTS | STATUS: STABLE
// PROTOCOL: DEV-CORE-7.3-SECURE
// AUTHOR: KAISA / MAJSTER-INTEGRATOR

import {
  ModuleShieldInfo,
  LogEntry,
  SecurityLevel,
  AuthToken,
  CipherPayload,
  SystemPerformance,
  ThreatLevel,
} from '../types';

/**
 * Mock Crypto-Core module providing AES-256-GCM & Ed25519 signing simulation
 */
export const CryptoCore = {
  generateHash: (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const randomSalt = Math.random().toString(16).substring(2, 10);
    return `0x${hex}${randomSalt}`.toUpperCase();
  },

  generateEd25519Keypair: () => {
    const pubKeyHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    const privKeyHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    return {
      publicKey: `ed25519_pk_${pubKeyHex.substring(0, 16)}...`,
      privateKeyFingerprint: `ed25519_sk_${privKeyHex.substring(0, 12)}...`,
      fingerprint: `FPR-${pubKeyHex.substring(0, 8).toUpperCase()}`,
    };
  },

  encrypt: (plaintext: string, quantumResistant: boolean = true): CipherPayload => {
    const iv = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    const tag = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    
    // Simple mock cipher encoding
    const encoded = btoa(encodeURIComponent(plaintext));
    const prefix = quantumResistant ? "Q-RES-AES256::" : "AES256::";
    const ciphertext = `${prefix}${encoded.split('').reverse().join('')}::$${tag.substring(0, 8)}`;

    const keypair = CryptoCore.generateEd25519Keypair();

    return {
      id: `CPH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      plaintext,
      ciphertext,
      algorithm: quantumResistant
        ? 'AES-256-GCM + Quantum-Resistant Wrapper'
        : 'AES-256-GCM',
      keyFingerprint: keypair.fingerprint,
      iv: `0x${iv}`,
      authTag: `0x${tag}`,
      encryptedAt: new Date().toISOString(),
    };
  },

  decrypt: (payload: CipherPayload): { success: boolean; result: string } => {
    try {
      if (!payload.ciphertext.includes('::')) {
        return { success: false, result: 'DECRYPTION_FAILED: Invalid cipher format' };
      }
      const parts = payload.ciphertext.split('::');
      const body = parts[1].split('::$')[0];
      const reversed = body.split('').reverse().join('');
      const decoded = decodeURIComponent(atob(reversed));
      return { success: true, result: decoded };
    } catch (e) {
      return { success: false, result: 'INTEGRITY_VIOLATION_AUTH_TAG_MISMATCH' };
    }
  },

  generateJwtToken: (role: AuthToken['role'], mfnaVerified: boolean = true): AuthToken => {
    const keypair = CryptoCore.generateEd25519Keypair();
    const tokenId = `JWT-MFNA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const now = new Date();
    const exp = new Date(now.getTime() + 3600 * 1000);

    return {
      tokenId,
      userId: `USR-NEURAL-${Math.floor(1000 + Math.random() * 9000)}`,
      role,
      mfnaVerified,
      neuralScore: mfnaVerified ? 98.4 : 42.1,
      keyType: 'Ed25519',
      keyFingerprint: keypair.fingerprint,
      signature: `sig_ed25519_${keypair.fingerprint}_${Math.random().toString(36).substring(2, 10)}`,
      issuedAt: now.toLocaleTimeString(),
      expiresAt: exp.toLocaleTimeString(),
    };
  },
};

/**
 * Singleton ETERNIVERSE-SEC-GUARD Core Manager
 */
export class SecGuard {
  private static instance: SecGuard;
  private activeWatchers: Map<string, AbortController> = new Map();
  private modules: Map<string, ModuleShieldInfo> = new Map();
  private ledger: LogEntry[] = [];
  private currentEd25519Fingerprint: string = "FPR-8F92A11C";
  private listeners: Set<() => void> = new Set();
  private version: number = 0;

  private constructor() {
    this.seedDefaultModules();
  }

  public static getInstance(): SecGuard {
    if (!SecGuard.instance) {
      SecGuard.instance = new SecGuard();
    }
    return SecGuard.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.version++;
    this.listeners.forEach((fn) => fn());
  }

  public getVersion(): number {
    return this.version;
  }

  /**
   * Seed default system modules
   */
  private seedDefaultModules() {
    const defaultList: Omit<ModuleShieldInfo, 'lastCheck'>[] = [
      {
        id: 'AUTH-MATRIX-01',
        name: 'AuthMatrix Neural Core',
        category: 'AUTH',
        securityLevel: 'CRITICAL',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('AUTH-MATRIX-01'),
        driftPercentage: 0.1,
        activeWatcher: true,
        syscallCount: 14200,
        cpuUsage: 12.4,
        memoryMb: 340,
      },
      {
        id: 'CIPHER-STREAM-02',
        name: 'CipherStream AES-256 Engine',
        category: 'CIPHER',
        securityLevel: 'CRITICAL',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('CIPHER-STREAM-02'),
        driftPercentage: 0.0,
        activeWatcher: true,
        syscallCount: 28900,
        cpuUsage: 18.2,
        memoryMb: 512,
      },
      {
        id: 'SENTINEL-NODE-03',
        name: 'SentinelNode Behavioral Inspector',
        category: 'NEURAL',
        securityLevel: 'CRITICAL',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('SENTINEL-NODE-03'),
        driftPercentage: 0.2,
        activeWatcher: true,
        syscallCount: 41200,
        cpuUsage: 24.1,
        memoryMb: 768,
      },
      {
        id: 'NET-GATEWAY-04',
        name: 'Quantum-Resistant TLS Bridge',
        category: 'NETWORK',
        securityLevel: 'STANDARD',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('NET-GATEWAY-04'),
        driftPercentage: 0.4,
        activeWatcher: true,
        syscallCount: 19800,
        cpuUsage: 8.9,
        memoryMb: 256,
      },
      {
        id: 'IMMUTABLE-LEDGER-05',
        name: 'Immutable Ledger Vault',
        category: 'STORAGE',
        securityLevel: 'CRITICAL',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('IMMUTABLE-LEDGER-05'),
        driftPercentage: 0.0,
        activeWatcher: true,
        syscallCount: 8400,
        cpuUsage: 4.5,
        memoryMb: 192,
      },
      {
        id: 'CORE-BUS-06',
        name: 'ETERNIVERSE Core IPC Bus',
        category: 'CORE',
        securityLevel: 'CRITICAL',
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash('CORE-BUS-06'),
        driftPercentage: 0.0,
        activeWatcher: true,
        syscallCount: 52100,
        cpuUsage: 15.6,
        memoryMb: 410,
      },
    ];

    const timestamp = new Date().toLocaleTimeString();
    defaultList.forEach((m) => {
      this.modules.set(m.id, { ...m, lastCheck: timestamp });
      this.isolateProcess(m.id);
    });

    this.addLog(
      'SYSTEM_INIT',
      'INFO',
      'ETERNIVERSE-SEC-GUARD initialized v2.4.1-LTS. All primary shields active.',
      'System startup under PROTOCOL DEV-CORE-7.3-SECURE.'
    );
  }

  /**
   * Inicjuje barierę ochronną dla określonego modułu.
   */
  public async initializeShield(
    moduleId: string,
    securityLevel: SecurityLevel = 'STANDARD'
  ): Promise<boolean> {
    console.log(`[SEC-GUARD] Activating shield for: ${moduleId} | Level: ${securityLevel}`);

    // Logic: Integrity Check
    const integrityHash = await this.performIntegrityCheck(moduleId);
    if (!integrityHash) {
      this.addLog(
        moduleId,
        'BREACH',
        'INTEGRITY_BREACH_DETECTED',
        `Integrity verification failed during shield activation for ${moduleId}.`
      );
      throw new Error(`INTEGRITY_BREACH_DETECTED: ${moduleId}`);
    }

    // Logic: Process Isolation
    this.isolateProcess(moduleId);

    // Update internal state
    const existing = this.modules.get(moduleId);
    if (existing) {
      existing.status = 'ACTIVE';
      existing.securityLevel = securityLevel;
      existing.activeWatcher = true;
      existing.driftPercentage = 0;
      existing.lastCheck = new Date().toLocaleTimeString();
    } else {
      this.modules.set(moduleId, {
        id: moduleId,
        name: `Dynamic Module [${moduleId}]`,
        category: 'CORE',
        securityLevel,
        status: 'ACTIVE',
        integrityHash: CryptoCore.generateHash(moduleId),
        driftPercentage: 0,
        activeWatcher: true,
        lastCheck: new Date().toLocaleTimeString(),
        syscallCount: 120,
        cpuUsage: 3.2,
        memoryMb: 128,
      });
    }

    this.addLog(
      moduleId,
      'INFO',
      'SHIELD_ACTIVATED',
      `Shield engaged at level ${securityLevel}. Active watcher registered with AbortController.`
    );

    this.notify();
    return true;
  }

  public async performIntegrityCheck(id: string): Promise<boolean> {
    const mod = this.modules.get(id);
    if (!mod) return true; // New module
    // If drift is over 80%, integrity fails
    if (mod.driftPercentage > 80 || mod.status === 'QUARANTINED') {
      return false;
    }
    // Refresh integrity hash
    mod.integrityHash = CryptoCore.generateHash(`${id}_${Date.now()}`);
    mod.lastCheck = new Date().toLocaleTimeString();
    return true;
  }

  public isolateProcess(id: string): void {
    if (this.activeWatchers.has(id)) {
      this.activeWatchers.get(id)?.abort();
    }
    const controller = new AbortController();
    this.activeWatchers.set(id, controller);

    const mod = this.modules.get(id);
    if (mod) {
      mod.activeWatcher = true;
    }
  }

  public triggerQuarantine(moduleId: string, reason: string): void {
    const mod = this.modules.get(moduleId);
    if (mod) {
      mod.status = 'QUARANTINED';
      mod.driftPercentage = 99.9;
      mod.cpuUsage = 0;
      mod.syscallCount = 0;
    }

    // Abort process watcher
    if (this.activeWatchers.has(moduleId)) {
      this.activeWatchers.get(moduleId)?.abort();
      this.activeWatchers.delete(moduleId);
    }

    this.addLog(
      moduleId,
      'QUARANTINE',
      'PROCESS_QUARANTINED',
      `SentinelNode placed ${moduleId} in cryptographic isolation. Reason: ${reason}`
    );

    this.notify();
  }

  public releaseFromQuarantine(moduleId: string): void {
    const mod = this.modules.get(moduleId);
    if (mod) {
      mod.status = 'ACTIVE';
      mod.driftPercentage = 0.5;
      mod.integrityHash = CryptoCore.generateHash(`${moduleId}_RESTORED`);
      mod.lastCheck = new Date().toLocaleTimeString();
      this.isolateProcess(moduleId);

      this.addLog(
        moduleId,
        'INFO',
        'QUARANTINE_LIFTED',
        `Process ${moduleId} restored after manual verification and key re-signing.`
      );
      this.notify();
    }
  }

  public rotateKeys(): string {
    const newKeys = CryptoCore.generateEd25519Keypair();
    this.currentEd25519Fingerprint = newKeys.fingerprint;

    this.addLog(
      'CIPHER-STREAM-02',
      'KEY_ROTATE',
      'ED25519_KEY_ROTATED',
      `Rotated master signing key to new fingerprint ${newKeys.fingerprint}. All active JWTs refreshed.`
    );

    this.notify();
    return newKeys.fingerprint;
  }

  public simulateBehavioralDrift(moduleId: string, deltaDrift: number): void {
    const mod = this.modules.get(moduleId);
    if (!mod) return;

    mod.driftPercentage = Math.min(100, Math.max(0, mod.driftPercentage + deltaDrift));
    mod.syscallCount += Math.floor(Math.random() * 500 + 100);
    mod.cpuUsage = Math.min(99.9, Number((mod.cpuUsage + deltaDrift * 0.4).toFixed(1)));

    if (mod.driftPercentage > 60 && mod.status === 'ACTIVE') {
      mod.status = 'DEGRADED';
      this.addLog(
        moduleId,
        'WARN',
        'BEHAVIORAL_DRIFT_ELEVATED',
        `Module ${mod.name} registered anomalous behavioral drift (${mod.driftPercentage.toFixed(1)}%).`
      );
    }

    if (mod.driftPercentage >= 85 && mod.status !== 'QUARANTINED') {
      this.triggerQuarantine(
        moduleId,
        `AUTOMATIC_SENTINEL_TRIGGER: Behavioral drift threshold exceeded (${mod.driftPercentage.toFixed(1)}%)`
      );
    }

    this.notify();
  }

  public addLog(
    moduleId: string,
    level: LogEntry['level'],
    event: string,
    details: string
  ): LogEntry {
    const timestamp = new Date().toLocaleTimeString();
    const rawData = `${timestamp}|${moduleId}|${level}|${event}|${details}`;
    const hash = CryptoCore.generateHash(rawData);

    const entry: LogEntry = {
      id: `LOG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp,
      moduleId,
      level,
      event,
      details,
      hash,
    };

    this.ledger.unshift(entry);
    // Keep max 100 logs
    if (this.ledger.length > 100) {
      this.ledger.pop();
    }

    this.notify();
    return entry;
  }

  // Getters
  public getModules(): ModuleShieldInfo[] {
    return Array.from(this.modules.values());
  }

  public getLedger(): LogEntry[] {
    return [...this.ledger];
  }

  public getCurrentKeyFingerprint(): string {
    return this.currentEd25519Fingerprint;
  }

  public getActiveWatchersCount(): number {
    return this.activeWatchers.size;
  }

  public getOverallThreatLevel(): ThreatLevel {
    const modules = this.getModules();
    const quarantined = modules.filter((m) => m.status === 'QUARANTINED');
    const degraded = modules.filter((m) => m.status === 'DEGRADED' || m.driftPercentage > 40);

    if (quarantined.length > 0) return 'CRITICAL_BREACH';
    if (degraded.length > 0) return 'ELEVATED';
    return 'NOMINAL';
  }

  public getSystemPerformance(): SystemPerformance {
    const modules = this.getModules();
    const active = modules.filter((m) => m.status === 'ACTIVE');
    const quarantined = modules.filter((m) => m.status === 'QUARANTINED');

    const totalCpu = active.reduce((acc, m) => acc + m.cpuUsage, 0);
    const totalMem = modules.reduce((acc, m) => acc + m.memoryMb, 0);
    const totalSyscalls = active.reduce((acc, m) => acc + m.syscallCount, 0);

    let threatScore = 5;
    modules.forEach((m) => {
      if (m.status === 'QUARANTINED') threatScore += 35;
      else if (m.status === 'DEGRADED') threatScore += 15;
      else threatScore += m.driftPercentage * 0.2;
    });

    return {
      cpuLoad: Math.min(100, Number(totalCpu.toFixed(1))),
      memoryUsageMb: Math.round(totalMem),
      networkIoKbps: Math.floor(Math.random() * 120 + 840),
      entropyLevel: 512, // Quantum-grade entropy
      activeWatchersCount: this.activeWatchers.size,
      quarantinedCount: quarantined.length,
      totalSyscallsSec: totalSyscalls,
      threatScore: Math.min(100, Math.round(threatScore)),
    };
  }
}
