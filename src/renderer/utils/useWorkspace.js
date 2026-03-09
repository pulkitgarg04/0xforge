import { useState, useCallback } from 'react';

export function useWorkspace() {
    const [workspacePath, setWorkspacePath] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);

    const handleOpenFolder = useCallback(async () => {
        const folderPath = await window.electronAPI.openFolder();
        if (folderPath) {
            setWorkspacePath(folderPath);
            setOpenFiles([]);
            setActiveFile(null);
        }
    }, []);

    const handleNewFile = useCallback(async () => {
        const filePath = await window.electronAPI.newFile();
        if (filePath) {
            const parts = filePath.split('/');
            const dirPath = parts.slice(0, -1).join('/');
            if (!workspacePath) {
                setWorkspacePath(dirPath);
            }
            if (!openFiles.includes(filePath)) {
                setOpenFiles((prev) => [...prev, filePath]);
            }
            setActiveFile(filePath);
        }
    }, [workspacePath, openFiles]);

    const handleFileOpen = useCallback((item) => {
        if (item.isDirectory) return;
        if (!openFiles.includes(item.path)) {
            setOpenFiles((prev) => [...prev, item.path]);
        }
        setActiveFile(item.path);
    }, [openFiles]);

    const handleSwitchFile = useCallback((filePath) => {
        setActiveFile(filePath);
    }, []);

    const handleCloseFile = useCallback((filePath) => {
        setOpenFiles((prev) => {
            const next = prev.filter((f) => f !== filePath);
            if (activeFile === filePath) {
                setActiveFile(next.length > 0 ? next[next.length - 1] : null);
            }
            return next;
        });
    }, [activeFile]);

    const showWelcome = !workspacePath;
    const activeFileName = activeFile ? activeFile.split('/').pop() : '';

    return {
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
    };
}
