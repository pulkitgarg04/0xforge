export default function AppTitleBar({ activeFileName }) {
  return (
    <div className="titlebar-drag h-12 flex items-center justify-center bg-forge-surface/80 backdrop-blur-sm border-b border-forge-border-subtle relative z-20 pl-20">
      <span className="text-xs font-medium text-forge-text-muted tracking-wide">
        0xForge{activeFileName ? ` — ${activeFileName}` : ""}
      </span>
    </div>
  );
}
