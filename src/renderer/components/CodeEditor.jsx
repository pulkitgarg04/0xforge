import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { sampleCode } from '../constants';

export default function CodeEditor() {
    const [code, setCode] = useState(sampleCode);

    return (
        <div className="flex-1 flex flex-col bg-forge-bg overflow-hidden">
            <div className="h-11 flex items-center bg-forge-surface border-b border-forge-border-subtle select-none">
                <div className="flex items-center h-full">
                    <div className="px-5 h-full flex items-center gap-2.5 text-sm border-r border-forge-border-subtle bg-forge-bg text-forge-text">
                        <span className="text-xs opacity-50">📄</span>
                        <span className="font-mono text-xs">main.cpp</span>
                        <span className="w-2 h-2 rounded-full bg-forge-accent ml-1.5" />
                    </div>
                    <div className="px-5 h-full flex items-center gap-2.5 text-sm text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-colors cursor-pointer">
                        <span className="text-xs opacity-50">📄</span>
                        <span className="font-mono text-xs">brute.cpp</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <Editor
                    defaultLanguage="cpp"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: 14,
                        lineHeight: 22,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        padding: { top: 16, bottom: 16 },
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'off',
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true,
                        },
                    }}
                />
            </div>
        </div>
    );
}
