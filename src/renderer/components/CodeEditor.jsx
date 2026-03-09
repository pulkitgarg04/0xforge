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

        monaco.editor.defineTheme('forge-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'e8dcc8', background: '1a1510' },
                { token: 'comment', foreground: '6e6050', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'c8b89a' },
                { token: 'keyword.control', foreground: 'c8b89a' },
                { token: 'storage', foreground: 'c8b89a' },
                { token: 'storage.type', foreground: 'c8b89a' },
                { token: 'string', foreground: '7eb87a' },
                { token: 'string.escape', foreground: 'a0d49c' },
                { token: 'number', foreground: 'd4a85c' },
                { token: 'constant', foreground: 'd4a85c' },
                { token: 'type', foreground: '7aacb8' },
                { token: 'type.identifier', foreground: '7aacb8' },
                { token: 'class', foreground: '7aacb8' },
                { token: 'function', foreground: 'd8c8aa' },
                { token: 'function.declaration', foreground: 'd8c8aa' },
                { token: 'variable', foreground: 'e8dcc8' },
                { token: 'variable.predefined', foreground: 'd4a85c' },
                { token: 'operator', foreground: 'a09080' },
                { token: 'delimiter', foreground: 'a09080' },
                { token: 'delimiter.bracket', foreground: 'a09080' },
                { token: 'tag', foreground: 'd47272' },
                { token: 'attribute.name', foreground: 'c8b89a' },
                { token: 'attribute.value', foreground: '7eb87a' },
                { token: 'identifier', foreground: 'e8dcc8' },
                { token: 'namespace', foreground: '7aacb8' },
                { token: 'preprocessor', foreground: 'b88aad' },
            ],
            colors: {
                'editor.background': '#1a1510',
                'editor.foreground': '#e8dcc8',
                'editor.lineHighlightBackground': '#231d1980',
                'editor.selectionBackground': '#c8b89a30',
                'editor.inactiveSelectionBackground': '#c8b89a15',
                'editorCursor.foreground': '#c8b89a',
                'editorLineNumber.foreground': '#6e6050',
                'editorLineNumber.activeForeground': '#a09080',
                'editorIndentGuide.background': '#2a221940',
                'editorIndentGuide.activeBackground': '#3a302880',
                'editorBracketMatch.background': '#c8b89a20',
                'editorBracketMatch.border': '#c8b89a40',
                'editorWidget.background': '#231d19',
                'editorWidget.border': '#3a3028',
                'editorSuggestWidget.background': '#231d19',
                'editorSuggestWidget.border': '#3a3028',
                'editorSuggestWidget.selectedBackground': '#2e2620',
                'editorGutter.background': '#1a1510',
                'scrollbar.shadow': '#00000000',
                'scrollbarSlider.background': '#3a302860',
                'scrollbarSlider.hoverBackground': '#3a302890',
                'scrollbarSlider.activeBackground': '#3a3028b0',
            },
        });
        monaco.editor.setTheme('forge-dark');

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

    const handleSaveAll = useCallback(async () => {
        const promises = Object.keys(modified).map(async (filePath) => {
            if (modified[filePath]) {
                const success = await window.electronAPI.writeFile(filePath, fileContentsRef.current[filePath]);
                if (success) {
                    setModified((prev) => ({ ...prev, [filePath]: false }));
                    if (onFileSaved) onFileSaved(filePath);
                }
            }
        });
        await Promise.all(promises);
    }, [modified, onFileSaved]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);

        const unsubscribeMenu = window.electronAPI.onMenuAction((action) => {
            if (action === 'save') handleSave();
            if (action === 'saveAll') handleSaveAll();

            if (!editorRef.current) return;
            const editor = editorRef.current;

            switch (action) {
                case 'expandSelection':
                    editor.trigger('menu', 'editor.action.smartSelect.expand');
                    break;
                case 'shrinkSelection':
                    editor.trigger('menu', 'editor.action.smartSelect.shrink');
                    break;
                case 'goToFile':
                    editor.trigger('menu', 'editor.action.quickCommand');
                    break;
                case 'goToSymbol':
                    editor.trigger('menu', 'editor.action.gotoSymbol');
                    break;
                case 'goToLine':
                    editor.trigger('menu', 'editor.action.gotoLine');
                    break;
            }
        });

        return () => {
            window.removeEventListener('keydown', handler);
            unsubscribeMenu();
        };
    }, [handleSave, handleSaveAll]);

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
                    theme="forge-dark"
                    loading={
                        <div className="flex-1 flex items-center justify-center bg-forge-bg">
                            <p className="text-sm text-forge-text-dim">Loading editor...</p>
                        </div>
                    }
                    options={{
                        fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                        fontSize: 13,
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
