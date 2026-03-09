import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import TestPanel from './components/TestPanel';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import { useWorkspace } from './utils/useWorkspace';

export default function App() {
    const [sidebarActive, setSidebarActive] = useState('files');
    const [bottomPanelTab, setBottomPanelTab] = useState('terminal');

    const {
        workspacePath,
        openFiles,
        activeFile,
        activeFileName,
        showWelcome,
        handleOpenFolder,
        handleNewFile,
        handleCloneRepo,
        handleFileOpen,
        handleSwitchFile,
        handleCloseFile,
    } = useWorkspace();

    const [hasOnboarded, setHasOnboarded] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const checkProfile = async () => {
            const profile = await window.electronAPI.getStore('userProfile');
            if (profile && profile.name) {
                setUserName(profile.name);
                setHasOnboarded(true);
            } else {
                setHasOnboarded(false);
            }
        };
        checkProfile();
    }, []);

    useEffect(() => {
        const unsubscribe = window.electronAPI.onMenuAction((action) => {
            if (action === 'newTerminal' || action === 'newTerminalWindow' || action === 'splitTerminal') {
                setBottomPanelTab('terminal');
            } else if (action === 'runTests' || action === 'runCode') {
                setBottomPanelTab('test');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleOnboardingComplete = (data) => {
        setUserName(data.name);
        setHasOnboarded(true);
    };

    if (hasOnboarded === null) {
        return null;
    }

    if (!hasOnboarded) {
        return (
            <div className="h-screen w-screen overflow-hidden">
                <OnboardingScreen onComplete={handleOnboardingComplete} />
            </div>
        );
    }

    if (showWelcome) {
        return (
            <div className="h-screen w-screen overflow-hidden">
                <WelcomeScreen userName={userName} onOpenFolder={handleOpenFolder} onNewFile={handleNewFile} onCloneRepo={handleCloneRepo} />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden relative">
            <div className="ambient-bg" />

            <div className="titlebar-drag h-12 flex items-center justify-center bg-forge-surface/80 backdrop-blur-sm border-b border-forge-border-subtle relative z-20 pl-20">
                <span className="text-xs font-medium text-forge-text-muted tracking-wide">
                    0xForge{activeFileName ? ` — ${activeFileName}` : ''}
                </span>
            </div>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <Sidebar active={sidebarActive} onSelect={setSidebarActive} onOpenFolder={handleOpenFolder} />

                {sidebarActive === 'files' && workspacePath && (
                    <FileExplorer
                        workspacePath={workspacePath}
                        onFileOpen={handleFileOpen}
                        activeFile={activeFile}
                    />
                )}

                <div className="flex-1 flex flex-col overflow-hidden">
                    <CodeEditor
                        openFiles={openFiles}
                        activeFile={activeFile}
                        onSwitchFile={handleSwitchFile}
                        onCloseFile={handleCloseFile}
                    />

                    {bottomPanelTab && (
                        <div className="h-64 flex flex-col border-t border-forge-border bg-forge-surface">
                            <div className="flex items-center gap-4 px-4 h-8 border-b border-forge-border-subtle bg-forge-surface/50 select-none">
                                <button
                                    onClick={() => setBottomPanelTab('test')}
                                    className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${bottomPanelTab === 'test' ? 'text-forge-text' : 'text-forge-text-muted hover:text-forge-text-dim'}`}
                                >
                                    Test Cases
                                </button>
                                <button
                                    onClick={() => setBottomPanelTab('terminal')}
                                    className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${bottomPanelTab === 'terminal' ? 'text-forge-text' : 'text-forge-text-muted hover:text-forge-text-dim'}`}
                                >
                                    Terminal
                                </button>
                                <div className="flex-1"></div>
                                <button onClick={() => setBottomPanelTab(null)} className="text-forge-text-muted hover:text-forge-text focus:outline-none">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                <div className={`absolute inset-0 ${bottomPanelTab === 'test' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
                                    <TestPanel />
                                </div>
                                <div className={`absolute inset-0 ${bottomPanelTab === 'terminal' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
                                    <TerminalPanel workspacePath={workspacePath} onClose={() => setBottomPanelTab(null)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <StatusBar workspacePath={workspacePath} activeFile={activeFile} />
        </div>
    );
}
