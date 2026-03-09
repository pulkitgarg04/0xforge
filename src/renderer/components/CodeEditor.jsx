import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Icon from './Icon';
import * as EditorIcons from './icons/editorIcons';

const extToLanguage = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    cpp: 'cpp',
    cc: 'cpp',
    c: 'c',
    h: 'cpp',
    hpp: 'cpp',
    java: 'java',
    rs: 'rust',
    go: 'go',
    rb: 'ruby',
    php: 'php',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    sh: 'shell',
    bash: 'shell',
    txt: 'plaintext',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
};

function getLanguage(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    return extToLanguage[ext] || 'plaintext';
}

function getFileName(filePath) {
    return filePath.split('/').pop();
}

export default function CodeEditor({ openFiles, activeFile, onSwitchFile, onCloseFile, onFileSaved }) {
    const [fileContents, setFileContents] = useState({});
    const [modified, setModified] = useState({});
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const fileContentsRef = useRef(fileContents);
    const loadingRef = useRef({});

    fileContentsRef.current = fileContents;

    const loadFile = useCallback(async (filePath) => {
        if (fileContentsRef.current[filePath] !== undefined || loadingRef.current[filePath]) return;
        loadingRef.current[filePath] = true;
        const content = await window.electronAPI.readFile(filePath);
        loadingRef.current[filePath] = false;
        if (content !== null) {
            setFileContents((prev) => ({ ...prev, [filePath]: content }));
        }
    }, []);

    useEffect(() => {
        openFiles.forEach((filePath) => {
            if (fileContentsRef.current[filePath] === undefined) {
                loadFile(filePath);
            }
        });
    }, [openFiles, loadFile]);

    useEffect(() => {
        if (!activeFile || !editorRef.current || !monacoRef.current) return;

        const monaco = monacoRef.current;
        const editor = editorRef.current;
        const uri = monaco.Uri.parse(`file://${activeFile}`);
        let model = monaco.editor.getModel(uri);

        const content = fileContentsRef.current[activeFile];
        if (content === undefined) return;

        if (!model) {
            model = monaco.editor.createModel(content, getLanguage(activeFile), uri);
        }

        if (editor.getModel() !== model) {
            editor.setModel(model);
        }
    }, [activeFile, fileContents]);

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        if (activeFile && fileContentsRef.current[activeFile] !== undefined) {
            const uri = monaco.Uri.parse(`file://${activeFile}`);
            let model = monaco.editor.getModel(uri);
            if (!model) {
                model = monaco.editor.createModel(
                    fileContentsRef.current[activeFile],
                    getLanguage(activeFile),
                    uri
                );
            }
            editor.setModel(model);
        }

        editor.onDidChangeModelContent(() => {
            const currentModel = editor.getModel();
            if (!currentModel) return;
            const filePath = currentModel.uri.path;
            const value = currentModel.getValue();
            setFileContents((prev) => ({ ...prev, [filePath]: value }));
            setModified((prev) => ({ ...prev, [filePath]: true }));
        });
    };

    const handleSave = useCallback(async () => {
        if (!activeFile || !modified[activeFile]) return;
        const success = await window.electronAPI.writeFile(activeFile, fileContentsRef.current[activeFile]);
        if (success) {
            setModified((prev) => ({ ...prev, [activeFile]: false }));
            if (onFileSaved) onFileSaved(activeFile);
        }
    }, [activeFile, modified, onFileSaved]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleSave]);

    const handleClose = (e, filePath) => {
        e.stopPropagation();

        if (monacoRef.current) {
            const uri = monacoRef.current.Uri.parse(`file://${filePath}`);
            const model = monacoRef.current.editor.getModel(uri);
            if (model) model.dispose();
        }

        setFileContents((prev) => {
            const next = { ...prev };
            delete next[filePath];
            return next;
        });
        setModified((prev) => {
            const next = { ...prev };
            delete next[filePath];
            return next;
        });
        onCloseFile(filePath);
    };

    if (openFiles.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-forge-bg">
                <div className="text-center">
                    <p className="text-sm text-forge-text-dim">Select a file to start editing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-forge-bg overflow-hidden">
            <div className="h-11 flex items-center bg-forge-surface border-b border-forge-border-subtle select-none overflow-x-auto">
                <div className="flex items-center h-full">
                    {openFiles.map((filePath) => (
                        <button key={filePath} onClick={() => onSwitchFile(filePath)}
                            className={`px-4 h-full flex items-center gap-2 text-sm border-r border-forge-border-subtle transition-colors cursor-pointer group
                                ${activeFile === filePath
                                    ? 'bg-forge-bg text-forge-text'
                                    : 'text-forge-text-muted hover:text-forge-text'}`}>
                            <span className="text-xs opacity-50">📄</span>
                            <span className="font-mono text-xs">{getFileName(filePath)}</span>
                            {modified[filePath] && (
                                <span className="w-2 h-2 rounded-full bg-forge-accent flex-shrink-0" />
                            )}
                            <button onClick={(e) => handleClose(e, filePath)}
                                className="ml-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-forge-error transition-opacity cursor-pointer flex-shrink-0"
                                title="Close">
                                <Icon d={EditorIcons.x} size={12} />
                            </button>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <Editor
                    defaultLanguage="plaintext"
                    defaultValue=""
                    onMount={handleEditorMount}
                    theme="vs-dark"
                    loading={
                        <div className="flex-1 flex items-center justify-center bg-forge-bg">
                            <p className="text-sm text-forge-text-dim">Loading editor...</p>
                        </div>
                    }
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
