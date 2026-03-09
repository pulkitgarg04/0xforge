import { useState, useEffect } from 'react';
import Icon from './Icon';
import * as GeneralIcons from './icons/generalIcons';
import TerminalInstance from './TerminalInstance';

let nextTermId = Date.now();

export default function TerminalPanel({ workspacePath, onClose }) {
    const [tabs, setTabs] = useState([{ id: `tab_${nextTermId}`, instances: [`term_${nextTermId++}`] }]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);

    useEffect(() => {
        if (!tabs.find(t => t.id === activeTabId) && tabs.length > 0) {
            setActiveTabId(tabs[tabs.length - 1].id);
        }
    }, [tabs, activeTabId]);

    useEffect(() => {
        const unsubscribe = window.electronAPI.onMenuAction((action) => {
            if (action === 'newTerminal' || action === 'newTerminalWindow') {
                const newTabId = `tab_${Date.now()}`;
                setTabs(prev => [...prev, { id: newTabId, instances: [`term_${nextTermId++}`] }]);
                setActiveTabId(newTabId);
            } else if (action === 'splitTerminal') {
                setTabs(prev => {
                    if (prev.length === 0) {
                        const newTabId = `tab_${Date.now()}`;
                        setActiveTabId(newTabId);
                        return [{ id: newTabId, instances: [`term_${nextTermId++}`, `term_${nextTermId++}`] }];
                    }
                    return prev.map(tab => {
                        if (tab.id === activeTabId) {
                            return { ...tab, instances: [...tab.instances, `term_${nextTermId++}`] };
                        }
                        return tab;
                    });
                });
            }
        });
        return () => unsubscribe();
    }, [activeTabId]);

    const handleCloseInstance = (tabId, instanceId) => {
        setTabs(prev => {
            const nextTabs = prev.map(tab => {
                if (tab.id === tabId) {
                    return { ...tab, instances: tab.instances.filter(i => i !== instanceId) };
                }
                return tab;
            }).filter(tab => tab.instances.length > 0);

            if (nextTabs.length === 0 && onClose) {
                onClose();
            }

            return nextTabs;
        });
    };

    const handleNewTerminal = () => {
        const newTabId = `tab_${Date.now()}`;
        setTabs(prev => [...prev, { id: newTabId, instances: [`term_${nextTermId++}`] }]);
        setActiveTabId(newTabId);
    };

    const handleSplitTerminal = () => {
        if (tabs.length === 0) {
            handleNewTerminal();
            return;
        }
        setTabs(prev => prev.map(tab => {
            if (tab.id === activeTabId) {
                return { ...tab, instances: [...tab.instances, `term_${nextTermId++}`] };
            }
            return tab;
        }));
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-forge-surface border-t border-forge-border">
            <div className="h-10 flex items-center justify-between px-2 text-xs border-b border-forge-border-subtle select-none">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {tabs.map((tab, idx) => (
                        <div key={tab.id} onClick={() => setActiveTabId(tab.id)}
                            className={`px-3 py-1 flex items-center gap-2 rounded-md cursor-pointer transition-colors max-w-[150px]
                             ${activeTabId === tab.id ? 'bg-forge-accent/15 text-forge-accent' : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover'}`}>
                            <Icon d={GeneralIcons.terminal} size={12} />
                            <span className="truncate">Terminal {idx + 1}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleCloseInstance(tab.id, tab.instances[0]); }} className="opacity-50 hover:opacity-100 focus:outline-none">
                                <Icon d={GeneralIcons.close} size={10} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-1 px-2 text-forge-text-muted">
                    <button onClick={handleNewTerminal} className="p-1.5 hover:bg-forge-surface-hover hover:text-forge-text rounded focus:outline-none" title="New Terminal">
                        <Icon d={GeneralIcons.plus} size={12} />
                    </button>
                    <button onClick={handleSplitTerminal} className="p-1.5 hover:bg-forge-surface-hover hover:text-forge-text rounded focus:outline-none" title="Split Terminal">
                        <Icon d={GeneralIcons.splitHorizontal} size={12} />
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="p-1.5 hover:bg-forge-surface-hover hover:text-forge-text rounded focus:outline-none" title="Close Panel">
                            <Icon d={GeneralIcons.close} size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden p-1">
                {tabs.map(tab => (
                    <div key={tab.id} className={`flex-1 flex overflow-hidden ${activeTabId === tab.id ? 'flex' : 'hidden'}`}>
                        {tab.instances.map((instanceId, idx) => (
                            <div key={instanceId} className={`flex-1 flex flex-col relative ${idx > 0 ? 'border-l border-forge-border-subtle pl-1 ml-1' : ''}`}>
                                {tab.instances.length > 1 && (
                                    <div className="absolute top-2 right-4 z-10 flex gap-1 bg-forge-bg/80 backdrop-blur rounded px-1 py-1">
                                        <button onClick={() => handleCloseInstance(tab.id, instanceId)} className="p-1 text-forge-text-muted hover:text-forge-text rounded focus:outline-none">
                                            <Icon d={GeneralIcons.close} size={12} />
                                        </button>
                                    </div>
                                )}
                                <div className="flex-1 w-full h-full overflow-hidden">
                                    <TerminalInstance id={instanceId} cwd={workspacePath} isActive={activeTabId === tab.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                {tabs.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-forge-text-muted text-sm">
                        No active terminals
                    </div>
                )}
            </div>
        </div>
    );
}
