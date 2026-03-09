import { useState } from 'react';
import { PlusIcon, FolderIcon, GitIcon, CommandIcon, GearIcon, SparkleIcon, ExtensionIcon } from './icons';
import { SectionHeader } from './welcome-screen/SectionHeader';
import { WelcomeItem } from './welcome-screen/WelcomeItem';

export default function WelcomeScreen({ onOpenFolder, onNewFile, onCloneRepo }) {
    const [showCloneInput, setShowCloneInput] = useState(false);
    const [cloneUrl, setCloneUrl] = useState('');
    const [cloning, setCloning] = useState(false);
    const [gitMissing, setGitMissing] = useState(false);
    const [installingGit, setInstallingGit] = useState(false);

    const handleCloneClick = async () => {
        const hasGit = await window.electronAPI.git.check();

        if (!hasGit) {
            setGitMissing(true);
            setShowCloneInput(false);
        } else {
            setGitMissing(false);
            setShowCloneInput(true);
        }
    };

    const handleInstallGit = async () => {
        setInstallingGit(true);

        await window.electronAPI.git.install();
        setInstallingGit(false);

        const hasGit = await window.electronAPI.git.check();
        if (hasGit) {
            setGitMissing(false);
            setShowCloneInput(true);
        }
    };

    const handleClone = async () => {
        if (!cloneUrl.trim()) return;

        setCloning(true);

        try {
            await onCloneRepo(cloneUrl.trim());
        } catch (e) {
            // error handled by parent
        }

        setCloning(false);
        setShowCloneInput(false);
        setCloneUrl('');
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#231d19ff',
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            <div style={{ width: '100%', maxWidth: '480px', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
                    <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                            <path d="M24 4L44 24L24 44L4 24Z" stroke="#c8b89a" strokeWidth="2" fill="none" />
                            <path d="M24 12L36 24L24 36L12 24Z" stroke="#c8b89a" strokeWidth="1.5" fill="none" />
                            <path d="M24 16V32M16 24H32" stroke="#c8b89a" strokeWidth="1.5" />
                            <path d="M24 4L24 12M44 24L36 24M24 44L24 36M4 24L12 24" stroke="#c8b89a" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#e8dcc8', margin: 0 }}>
                            Welcome back to 0xForge
                        </h1>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#a09080', margin: '4px 0 0 0' }}>
                            The forge for <span style={{ fontStyle: 'normal' }}>competitive minds</span>
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '48px' }}>
                    <SectionHeader label="Get Started" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <WelcomeItem icon={<PlusIcon />} label="New File" shortcut="⌘ N" onClick={onNewFile} />
                        <WelcomeItem icon={<FolderIcon />} label="Open Project" shortcut="⌘ O" onClick={onOpenFolder} />
                        <WelcomeItem icon={<GitIcon />} label="Clone Repository" onClick={handleCloneClick} />

                        {gitMissing && (
                            <div style={{
                                padding: '12px 16px',
                                margin: '4px 0',
                                borderRadius: '6px',
                                backgroundColor: '#2a1f1a',
                                border: '1px solid #3a3028',
                            }}>
                                <p style={{ fontSize: '13px', color: '#d4a85c', margin: '0 0 8px 0' }}>
                                    ⚠ Git is not installed on your system
                                </p>
                                <p style={{ fontSize: '12px', color: '#a09080', margin: '0 0 12px 0' }}>
                                    Git is required to clone repositories. Install it to continue.
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={handleInstallGit}
                                        disabled={installingGit}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#c8b89a',
                                            color: '#1a1510',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: installingGit ? 'wait' : 'pointer',
                                        }}
                                    >
                                        {installingGit ? 'Installing...' : 'Install Git'}
                                    </button>
                                    <button
                                        onClick={() => setGitMissing(false)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            border: '1px solid #3a3028',
                                            background: 'transparent',
                                            color: '#a09080',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {showCloneInput && (
                            <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    value={cloneUrl}
                                    onChange={(e) => setCloneUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleClone();
                                        if (e.key === 'Escape') { setShowCloneInput(false); setCloneUrl(''); }
                                    }}
                                    placeholder="https://github.com/pulkitgarg04/repo.git"
                                    disabled={cloning}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #3a3028',
                                        background: '#1a1510',
                                        color: '#e8dcc8',
                                        fontSize: '13px',
                                        fontFamily: "'Menlo', monospace",
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleClone}
                                    disabled={cloning || !cloneUrl.trim()}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: cloning ? '#3a3028' : '#c8b89a',
                                        color: cloning ? '#a09080' : '#1a1510',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: cloning ? 'wait' : 'pointer',
                                    }}
                                >
                                    {cloning ? 'Cloning...' : 'Clone'}
                                </button>
                            </div>
                        )}

                        <WelcomeItem icon={<CommandIcon />} label="Open Command Palette" shortcut="⌘ ⇧ P" />
                    </div>
                </div>

                <div>
                    <SectionHeader label="Configure" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <WelcomeItem icon={<GearIcon />} label="Open Settings" shortcut="⌘ ," />
                        <WelcomeItem icon={<SparkleIcon />} label="View AI Settings" />
                        <WelcomeItem icon={<ExtensionIcon />} label="Explore Extensions" shortcut="⌘ ⇧ X" />
                    </div>
                </div>
            </div>
        </div>
    );
}
