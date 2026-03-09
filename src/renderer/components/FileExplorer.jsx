import { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
import * as FileIcons from './icons/fileExplorerIcons';

function TreeItem({ item, depth, onFileClick, activeFile, onDelete, onRefresh }) {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadChildren = useCallback(async () => {
        if (!item.isDirectory) return;
        setLoading(true);
        const items = await window.electronAPI.readDir(item.path);
        setChildren(items);
        setLoading(false);
    }, [item.path, item.isDirectory]);

    const handleToggle = async () => {
        if (!item.isDirectory) {
            onFileClick(item);
            return;
        }
        if (!expanded) {
            await loadChildren();
        }
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (expanded) loadChildren();
    }, [onRefresh]);

    const isActive = !item.isDirectory && activeFile === item.path;

    return (
        <div>
            <button
                onClick={handleToggle}
                className={`w-full text-left flex items-center gap-1.5 py-[5px] pr-3 rounded-md text-[13px] transition-colors cursor-pointer group
                    ${isActive
                        ? 'bg-forge-accent/10 text-forge-accent'
                        : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover'}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
                {item.isDirectory && (
                    <Icon d={FileIcons.chevronR} size={12}
                        className={`transition-transform duration-150 opacity-50 flex-shrink-0 ${expanded ? 'rotate-90' : ''}`} />
                )}
                {!item.isDirectory && <span className="w-3 flex-shrink-0" />}

                <Icon
                    d={item.isDirectory ? FileIcons.folder : FileIcons.file}
                    size={14}
                    className={`flex-shrink-0 ${item.isDirectory ? 'text-forge-warning/70' : 'opacity-40'}`}
                />
                <span className="font-mono text-xs truncate flex-1">{item.name}</span>

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-forge-error transition-opacity cursor-pointer flex-shrink-0"
                    title="Delete"
                >
                    <Icon d={FileIcons.trash} size={12} />
                </button>
            </button>

            {item.isDirectory && expanded && (
                <div>
                    {loading && (
                        <div className="text-xs text-forge-text-dim py-1" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
                            Loading…
                        </div>
                    )}
                    {children.map((child) => (
                        <TreeItem
                            key={child.path}
                            item={child}
                            depth={depth + 1}
                            onFileClick={onFileClick}
                            activeFile={activeFile}
                            onDelete={onDelete}
                            onRefresh={onRefresh}
                        />
                    ))}
                    {!loading && children.length === 0 && (
                        <div className="text-xs text-forge-text-dim py-1 italic" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
                            Empty
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer({ workspacePath, onFileOpen, activeFile }) {
    const [rootItems, setRootItems] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [newItemType, setNewItemType] = useState(null);
    const [newItemName, setNewItemName] = useState('');

    const workspaceName = workspacePath ? workspacePath.split('/').pop() : '';

    const loadRoot = useCallback(async () => {
        if (!workspacePath) return;
        const items = await window.electronAPI.readDir(workspacePath);
        setRootItems(items);
    }, [workspacePath]);

    useEffect(() => {
        loadRoot();
    }, [loadRoot, refreshKey]);

    const handleCreateItem = async () => {
        if (!newItemName.trim()) {
            setNewItemType(null);
            return;
        }
        const fullPath = `${workspacePath}/${newItemName.trim()}`;
        if (newItemType === 'file') {
            await window.electronAPI.createFile(fullPath);
        } else {
            await window.electronAPI.createFolder(fullPath);
        }
        setNewItemName('');
        setNewItemType(null);
        setRefreshKey((k) => k + 1);
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(`Delete "${item.name}"?`);
        if (!confirmed) return;
        await window.electronAPI.deleteFile(item.path);
        setRefreshKey((k) => k + 1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCreateItem();
        if (e.key === 'Escape') { setNewItemType(null); setNewItemName(''); }
    };

    return (
        <div className="w-60 bg-forge-surface border-r border-forge-border-subtle flex flex-col">
            <div className="h-11 flex items-center justify-between px-4 border-b border-forge-border-subtle select-none">
                <span className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest truncate">
                    {workspaceName}
                </span>
                <div className="flex items-center gap-1">
                    <button onClick={() => setNewItemType('file')} title="New File"
                        className="w-6 h-6 flex items-center justify-center rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-colors cursor-pointer">
                        <Icon d={FileIcons.filePlus} size={14} />
                    </button>
                    <button onClick={() => setNewItemType('folder')} title="New Folder"
                        className="w-6 h-6 flex items-center justify-center rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-colors cursor-pointer">
                        <Icon d={FileIcons.folderPlus} size={14} />
                    </button>
                    <button onClick={() => setRefreshKey((k) => k + 1)} title="Refresh"
                        className="w-6 h-6 flex items-center justify-center rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover transition-colors cursor-pointer">
                        <Icon d={FileIcons.refresh} size={13} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {newItemType && (
                    <div className="px-3 mb-1">
                        <div className="flex items-center gap-1.5 px-2">
                            <Icon
                                d={newItemType === 'file' ? FileIcons.file : FileIcons.folder}
                                size={13}
                                className={newItemType === 'folder' ? 'text-forge-warning/70' : 'opacity-40'}
                            />
                            <input
                                autoFocus
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleCreateItem}
                                placeholder={newItemType === 'file' ? 'filename.cpp' : 'folder name'}
                                className="flex-1 bg-forge-bg text-xs font-mono text-forge-text px-2 py-1 rounded border border-forge-accent/50 outline-none"
                            />
                        </div>
                    </div>
                )}

                {rootItems.map((item) => (
                    <TreeItem
                        key={item.path}
                        item={item}
                        depth={0}
                        onFileClick={onFileOpen}
                        activeFile={activeFile}
                        onDelete={handleDelete}
                        onRefresh={refreshKey}
                    />
                ))}
            </div>
        </div>
    );
}
