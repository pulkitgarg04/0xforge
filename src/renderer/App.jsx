import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import TestPanel from './components/TestPanel';
import StatusBar from './components/StatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import { useWorkspace } from './utils/useWorkspace';

export default function App() {
    const [sidebarActive, setSidebarActive] = useState('files');

    const {
        workspacePath,
        openFiles,
        activeFile,
        activeFileName,
        showWelcome,
        handleOpenFolder,
        handleNewFile,
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
                <WelcomeScreen userName={userName} onOpenFolder={handleOpenFolder} onNewFile={handleNewFile} />
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
                    <TestPanel />
                </div>
            </div>

            <StatusBar workspacePath={workspacePath} activeFile={activeFile} />
        </div>
    );
}
