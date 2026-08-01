import React, { useState } from 'react';
import { Cpu, ShieldAlert, Zap, Send, RefreshCw, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';
import { LogEntry, AiSecurityAnalysis } from '../../types';

interface KaisaAiIntelViewProps {
  initialLog?: LogEntry | null;
  theme: 'neon-dark' | 'tactical-light';
}

export const KaisaAiIntelView: React.FC<KaisaAiIntelViewProps> = ({ initialLog, theme }) => {
  const isDark = theme === 'neon-dark';

  const [promptInput, setPromptInput] = useState<string>(
    initialLog
      ? `Log event: ${initialLog.event} on module ${initialLog.moduleId}. Details: ${initialLog.details}`
      : 'Behavioral drift detected in AuthMatrix Neural Core. System call trace registered unauthorized memory map allocation.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AiSecurityAnalysis | null>(null);

  const handleRunAiAnalysis = async (customText?: string) => {
    const textToAnalyze = customText || promptInput;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai-sec-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatLogs: textToAnalyze,
          alertType: 'SEC_GUARD_ANOMALY',
          moduleTarget: 'SYSTEM-CORE',
          systemCallTrace: textToAnalyze,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult({
          severity: 'HIGH',
          vector: 'ANOMALY_HEURISTIC_TRIGGER',
          summary: 'Security anomaly flagged by SentinelNode fallback heuristics.',
          recommendations: [
            'Trigger process quarantine for target module.',
            'Rotate Ed25519 master signing keys.',
            'Re-verify MFNA biometric token signatures.',
          ],
          countermeasure: 'Process isolated under default Zero-Trust ruleset.',
        });
      }
    } catch (e: any) {
      setAnalysisResult({
        severity: 'MEDIUM',
        vector: 'NETWORK_TIMEOUT',
        summary: 'Server AI response timeout. Fallback defense rules engaged.',
        recommendations: [
          'Verify connection to core bus.',
          'Execute manual integrity sweep.',
        ],
        countermeasure: 'Standard shield maintained.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Title Header */}
      <div className={`p-4 border rounded flex flex-wrap justify-between items-center ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/80 text-cyan-400 border border-cyan-500/50 rounded shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              KAISA AI INTEL :: THREAT INTELLIGENCE CORE (GEMINI)
            </h2>
            <p className="text-xs text-zinc-500">
              AI-assisted cyber threat vector analysis, root-cause assessment & automated countermeasure generation.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/50 px-3 py-1 rounded">
          MODEL: GEMINI-3.6-FLASH
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>THREAT LOG / QUERY INGESTION</span>
            </h3>
            <span className="text-xs text-zinc-500">KAISA DISPATCH</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="text-zinc-400 block">Enter Security Event, Log Trace or Attack Vector:</label>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={5}
              className="w-full p-3 bg-black border border-zinc-800 text-cyan-300 focus:border-cyan-500 focus:outline-none rounded font-mono text-xs"
              placeholder="Describe anomaly or paste system call trace..."
            ></textarea>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 block">Quick Preset Attack Scenarios:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '/matrix-check --trace PID=1402',
                  '/splice --target KMS --action ROTATE',
                  '/manifest export --type audit-log --format json',
                  'Quantum Decryption Probe on CipherStream',
                  'MFNA Neural Biometric Forgery Attack',
                  'Behavioral Drift Spike (85%+ Jail-Cell Trigger)',
                  'Ed25519 Key Tampering & Signature Invalidated',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setPromptInput(preset);
                      handleRunAiAnalysis(preset);
                    }}
                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-cyan-500/60 rounded text-[10px] transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRunAiAnalysis()}
              disabled={loading}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold rounded shadow-[0_0_12px_rgba(6,182,212,0.4)] transition flex justify-center items-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>KAISA ANALYZING THREAT VECTOR...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>DISPATCH TO KAISA THREAT ENGINE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Intelligence Report Panel */}
        <div className={`p-5 border rounded space-y-4 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>KAISA EVALUATION REPORT</span>
            </h3>
            {analysisResult && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  analysisResult.severity === 'CRITICAL'
                    ? 'bg-red-500 text-black animate-pulse'
                    : analysisResult.severity === 'HIGH'
                    ? 'bg-amber-500 text-black'
                    : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}
              >
                SEVERITY: {analysisResult.severity}
              </span>
            )}
          </div>

          {!analysisResult && !loading && (
            <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
              <Cpu className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
              <p>Awaiting Threat Dispatch from SentinelNode or Operator.</p>
              <p className="text-[10px] text-zinc-600">
                Click "DISPATCH TO KAISA THREAT ENGINE" or choose a preset attack scenario.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-8 text-center text-cyan-400 text-xs space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="font-bold tracking-widest">SYNTHESIZING ZERO-TRUST THREAT VECTOR...</p>
              <p className="text-[10px] text-zinc-500">Querying Gemini 3.6 Flash security model</p>
            </div>
          )}

          {analysisResult && !loading && (
            <div className="space-y-4 text-xs font-mono">
              {/* Vector Tag */}
              <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded flex justify-between items-center">
                <span className="text-zinc-400">Threat Vector:</span>
                <span className="text-cyan-400 font-bold">{analysisResult.vector}</span>
              </div>

              {/* Technical Summary */}
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-bold">
                  KAISA Technical Evaluation Summary:
                </span>
                <p className="p-3 bg-black border border-zinc-800 text-zinc-200 rounded leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-bold">
                  Recommended Defense Protocol:
                </span>
                <div className="space-y-1.5">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-zinc-900/80 border border-zinc-800 rounded text-cyan-300 flex items-start space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Countermeasure */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/50 rounded flex items-center space-x-3 text-cyan-200">
                <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                    SecGuard Automated Countermeasure:
                  </span>
                  <p className="text-xs">{analysisResult.countermeasure}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
