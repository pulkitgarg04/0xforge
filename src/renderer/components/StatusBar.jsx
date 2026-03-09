export default function StatusBar({ workspacePath, activeFile }) {
    const workspaceName = workspacePath ? workspacePath.split('/').pop() : '';
    const fileName = activeFile ? activeFile.split('/').pop() : '';
    const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';

    const langMap = {
        cpp: 'C++', cc: 'C++', c: 'C', h: 'C++', hpp: 'C++',
        py: 'Python', js: 'JavaScript', jsx: 'JavaScript',
        ts: 'TypeScript', tsx: 'TypeScript',
        java: 'Java', rs: 'Rust', go: 'Go',
        html: 'HTML', css: 'CSS', json: 'JSON',
        md: 'Markdown', sh: 'Shell', txt: 'Plain Text',
    };
    const language = langMap[ext] || ext.toUpperCase() || '-';

    return (
        <footer className="h-7 flex items-center justify-between px-5 bg-forge-surface border-t border-forge-border-subtle text-[11px] text-forge-text-dim select-none">
            <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                    <span className="w-[7px] h-[7px] rounded-full bg-forge-success" />
                    Ready
                </span>
                {language !== '-' && <span>{language}</span>}
                <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-5">
                {workspaceName && <span className="text-forge-text-muted">{workspaceName}</span>}
                <span>Spaces: 4</span>
                <span className="text-forge-accent font-semibold tracking-wide">0xForge</span>
            </div>
        </footer>
    );
}
