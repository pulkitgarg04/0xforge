import Icon from './Icon';
import * as GeneralIcons from './icons/generalIcons';

export default function Sidebar({ active, onSelect, onOpenFolder }) {
    const items = [
        { key: 'files', icon: GeneralIcons.files, label: 'Explorer' },
        { key: 'search', icon: GeneralIcons.search, label: 'Search' },
        { key: 'testing', icon: GeneralIcons.flask, label: 'Test Cases' },
        { key: 'terminal', icon: GeneralIcons.terminal, label: 'Terminal' },
    ];

    return (
        <aside className="w-[52px] bg-forge-surface flex flex-col items-center pt-4 pb-3 gap-1.5 border-r border-forge-border-subtle">
            {items.map(({ key, icon, label }) => (
                <button key={key} title={label} onClick={() => onSelect(key)}
                    className={`w-[38px] h-[38px] flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer
                        ${active === key
                            ? 'bg-forge-accent/15 text-forge-accent'
                            : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover'}`}>
                    <Icon d={icon} size={18} />
                </button>
            ))}

            <div className="flex-1" />

            <button title="Open Folder" onClick={onOpenFolder}
                className="w-[38px] h-[38px] flex items-center justify-center rounded-lg text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-all duration-150 cursor-pointer">
                <Icon d={GeneralIcons.folder} size={18} />
            </button>

            <button title="Settings"
                className="w-[38px] h-[38px] flex items-center justify-center rounded-lg text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-all duration-150 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>
        </aside>
    );
}
