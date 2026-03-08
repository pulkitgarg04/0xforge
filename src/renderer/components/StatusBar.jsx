export default function StatusBar() {
    return (
        <footer className="h-7 flex items-center justify-between px-5 bg-forge-surface border-t border-forge-border-subtle text-[11px] text-forge-text-dim select-none">
            <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                    <span className="w-[7px] h-[7px] rounded-full bg-forge-success" />
                    Ready
                </span>
                <span>C++ 17</span>
                <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-5">
                <span>Ln 1, Col 1</span>
                <span>Spaces: 4</span>
                <span className="text-forge-accent font-semibold tracking-wide">0xForge</span>
            </div>
        </footer>
    );
}
