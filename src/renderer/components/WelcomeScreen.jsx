import { PlusIcon, FolderIcon, GitIcon, CommandIcon, GearIcon, SparkleIcon, ExtensionIcon } from './icons';
import { SectionHeader } from './welcome-screen/SectionHeader';
import { WelcomeItem } from './welcome-screen/WelcomeItem';

export default function WelcomeScreen({ onOpenFolder, onNewFile }) {
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
                        <WelcomeItem icon={<GitIcon />} label="Clone Repository" />
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
