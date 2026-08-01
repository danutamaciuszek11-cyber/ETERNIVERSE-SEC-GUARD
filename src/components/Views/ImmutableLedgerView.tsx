import React, { useState } from 'react';
import { Terminal, Search, Download, Copy, Check, ShieldAlert, Filter, Cpu } from 'lucide-react';
import { LogEntry, LogSeverity } from '../../types';

interface ImmutableLedgerViewProps {
  ledger: LogEntry[];
  theme: 'neon-dark' | 'tactical-light';
  onOpenAiAnalysis: (log: LogEntry) => void;
}

export const ImmutableLedgerView: React.FC<ImmutableLedgerViewProps> = ({
  ledger,
  theme,
  onOpenAiAnalysis,
}) => {
  const isDark = theme === 'neon-dark';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = ledger.filter((log) => {
    const matchesQuery =
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.moduleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' || log.level === selectedSeverity;

    return matchesQuery && matchesSeverity;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(ledger, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ETERNIVERSE_IMMUTABLE_LEDGER_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Title Header */}
      <div className={`p-4 border rounded flex flex-wrap justify-between items-center ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 rounded">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              ImmutableLedger :: CRYPTOGRAPHIC AUDIT LOG & RECOVERY VAULT
            </h2>
            <p className="text-xs text-zinc-500">
              Tamper-proof append-only event log with SHA-256 verification signatures.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJson}
          className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-bold text-xs rounded shadow-[0_0_10px_rgba(16,185,129,0.3)] transition flex items-center space-x-2"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>EXPORT AUDIT LEDGER (JSON)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 border rounded space-y-3 ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Event, Module ID, Details, or SHA Hash..."
              className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 text-cyan-300 focus:border-cyan-500 focus:outline-none rounded text-xs font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-black border border-zinc-800 text-cyan-400 px-3 py-2 rounded text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="BREACH">BREACH</option>
              <option value="QUARANTINE">QUARANTINE</option>
              <option value="KEY_ROTATE">KEY_ROTATE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={`border rounded overflow-hidden ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">SEVERITY</th>
                <th className="p-3">MODULE TARGET</th>
                <th className="p-3">EVENT IDENTIFIER</th>
                <th className="p-3">DETAILS / REASON</th>
                <th className="p-3">CRYPTOGRAPHIC HASH</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-500 text-xs">
                    No ledger entries match the current search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isBreach = log.level === 'BREACH' || log.level === 'QUARANTINE';
                  const isWarn = log.level === 'WARN';

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-zinc-900/60 transition ${
                        isBreach ? 'bg-red-950/20' : isWarn ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="p-3 text-zinc-400 whitespace-nowrap">{log.timestamp}</td>

                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBreach
                              ? 'bg-red-500 text-black'
                              : isWarn
                              ? 'bg-amber-500 text-black'
                              : log.level === 'KEY_ROTATE'
                              ? 'bg-purple-500 text-black'
                              : 'bg-zinc-800 text-cyan-400'
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>

                      <td className="p-3 text-cyan-400 font-bold whitespace-nowrap">
                        {log.moduleId}
                      </td>

                      <td className="p-3 text-white font-bold whitespace-nowrap">{log.event}</td>

                      <td className="p-3 text-zinc-300 max-w-md truncate">{log.details}</td>

                      <td className="p-3 text-zinc-500 font-mono text-[10px] whitespace-nowrap">
                        <button
                          onClick={() => handleCopyHash(log.hash)}
                          className="hover:text-cyan-400 flex items-center space-x-1"
                        >
                          <span>{log.hash.substring(0, 14)}...</span>
                          {copiedHash === log.hash ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-600" />
                          )}
                        </button>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenAiAnalysis(log)}
                          className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 text-[10px] rounded font-bold transition flex items-center space-x-1 ml-auto"
                        >
                          <Cpu className="w-3 h-3 text-cyan-400" />
                          <span>AI ANALYZE</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
