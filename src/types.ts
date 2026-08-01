export type SecurityLevel = 'STANDARD' | 'CRITICAL';
export type ThreatLevel = 'NOMINAL' | 'ELEVATED' | 'CRITICAL_BREACH';

export type ModuleCategory = 'CORE' | 'AUTH' | 'CIPHER' | 'NETWORK' | 'STORAGE' | 'NEURAL';
export type ModuleStatus = 'ACTIVE' | 'QUARANTINED' | 'DEGRADED' | 'INITIALIZING';

export interface ModuleShieldInfo {
  id: string;
  name: string;
  category: ModuleCategory;
  securityLevel: SecurityLevel;
  status: ModuleStatus;
  integrityHash: string;
  driftPercentage: number;
  activeWatcher: boolean;
  lastCheck: string;
  syscallCount: number;
  cpuUsage: number;
  memoryMb: number;
}

export type LogSeverity = 'INFO' | 'WARN' | 'BREACH' | 'QUARANTINE' | 'KEY_ROTATE';

export interface LogEntry {
  id: string;
  timestamp: string;
  moduleId: string;
  level: LogSeverity;
  event: string;
  details: string;
  hash: string;
}

export interface AuthToken {
  tokenId: string;
  userId: string;
  role: 'SUPER_ADMIN' | 'SECURITY_OPERATOR' | 'CYBER_AUDITOR' | 'GUEST';
  mfnaVerified: boolean;
  neuralScore: number; // 0 to 100 MFNA biometric matching score
  keyType: 'Ed25519';
  keyFingerprint: string;
  signature: string;
  issuedAt: string;
  expiresAt: string;
}

export interface CipherPayload {
  id: string;
  plaintext: string;
  ciphertext: string;
  algorithm: 'AES-256-GCM' | 'AES-256-GCM + Quantum-Resistant Wrapper';
  keyFingerprint: string;
  iv: string;
  authTag: string;
  encryptedAt: string;
}

export interface SystemPerformance {
  cpuLoad: number; // percentage
  memoryUsageMb: number; // MB
  networkIoKbps: number; // KB/s
  entropyLevel: number; // bits
  activeWatchersCount: number;
  quarantinedCount: number;
  totalSyscallsSec: number;
  threatScore: number; // 0 to 100
}

export interface AiSecurityAnalysis {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vector: string;
  summary: string;
  recommendations: string[];
  countermeasure: string;
}
