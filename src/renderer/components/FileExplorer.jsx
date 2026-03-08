import Icon from './Icon';
import { icons } from '../constants';

export default function FileExplorer() {
    const files = [
        { name: 'main.cpp', active: true },
        { name: 'brute.cpp', active: false },
        { name: 'gen.cpp', active: false },
        { name: 'stress.sh', active: false },
    ];

    return (
        <div className="w-60 bg-forge-surface border-r border-forge-border-subtle flex flex-col">
            <div className="h-11 flex items-center px-5 text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest border-b border-forge-border-subtle select-none">
                Explorer
            </div>
            <div className="flex-1 overflow-y-auto py-3 px-3">
                <div className="mb-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-forge-text-muted uppercase tracking-wider mb-2 px-2">
                        <Icon d={icons.chevronR} size={10} className="rotate-90 opacity-60" />
                        <span>Problem A</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {files.map((f) => (
                            <button key={f.name}
                                className={`w-full text-left px-3 py-[7px] rounded-md text-[13px] flex items-center gap-2.5 transition-colors cursor-pointer
                                    ${f.active
                                        ? 'bg-forge-accent/10 text-forge-accent'
                                        : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover'}`}>
                                <span className="text-xs opacity-50">📄</span>
                                <span className="font-mono text-xs">{f.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
