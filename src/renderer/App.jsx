import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import TestPanel from './components/TestPanel';
import StatusBar from './components/StatusBar';

export default function App() {
    const [sidebarActive, setSidebarActive] = useState('files');

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden relative">
            <div className="ambient-bg" />

            <div className="titlebar-drag h-12 flex items-center justify-center bg-forge-surface/80 backdrop-blur-sm border-b border-forge-border-subtle relative z-20 pl-20">
                <span className="text-xs font-medium text-forge-text-muted tracking-wide">
                    0xForge — main.cpp
                </span>
            </div>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <Sidebar active={sidebarActive} onSelect={setSidebarActive} />

                {sidebarActive === 'files' && <FileExplorer />}

                <div className="flex-1 flex flex-col overflow-hidden">
                    <CodeEditor />
                    <TestPanel />
                </div>
            </div>

            <StatusBar />
        </div>
    );
}
