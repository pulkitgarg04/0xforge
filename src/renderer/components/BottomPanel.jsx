import TestPanel from "./TestPanel";
import TerminalPanel from "./TerminalPanel";

export default function BottomPanel({
  bottomPanelTab,
  setBottomPanelTab,
  testCases,
  workspacePath,
}) {
  if (!bottomPanelTab) {
    return null;
  }

  return (
    <div className="h-64 flex flex-col border-t border-forge-border bg-forge-surface">
      <div className="flex items-center gap-4 px-4 h-8 border-b border-forge-border-subtle bg-forge-surface/50 select-none">
        <button
          onClick={() => setBottomPanelTab("test")}
          className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${bottomPanelTab === "test" ? "text-forge-text" : "text-forge-text-muted hover:text-forge-text-dim"}`}
        >
          Test Cases
        </button>
        <button
          onClick={() => setBottomPanelTab("terminal")}
          className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${bottomPanelTab === "terminal" ? "text-forge-text" : "text-forge-text-muted hover:text-forge-text-dim"}`}
        >
          Terminal
        </button>
        <div className="flex-1"></div>
        <button
          onClick={() => setBottomPanelTab(null)}
          className="text-forge-text-muted hover:text-forge-text focus:outline-none"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`absolute inset-0 ${bottomPanelTab === "test" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"}`}
        >
          <TestPanel testCases={testCases} />
        </div>
        <div
          className={`absolute inset-0 ${bottomPanelTab === "terminal" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"}`}
        >
          <TerminalPanel
            workspacePath={workspacePath}
            onClose={() => setBottomPanelTab(null)}
          />
        </div>
      </div>
    </div>
  );
}
