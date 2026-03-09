import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function TerminalInstance({ id, cwd, isActive }) {
    const containerRef = useRef(null);
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const initializedRef = useRef(false);

    const handleClick = useCallback(() => {
        if (xtermRef.current) {
            xtermRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (!terminalRef.current || initializedRef.current) return;
        initializedRef.current = true;

        const term = new Terminal({
            theme: {
                background: '#1a1510',
                foreground: '#e8dcc8',
                cursor: '#c8b89a',
                cursorAccent: '#1a1510',
                selectionBackground: 'rgba(200, 184, 154, 0.25)',
                selectionForeground: '#ffffff',
                black: '#231d19',
                red: '#d47272',
                green: '#7eb87a',
                yellow: '#d4a85c',
                blue: '#7aacb8',
                magenta: '#b88aad',
                cyan: '#7ab8a8',
                white: '#e8dcc8',
                brightBlack: '#6e6050',
                brightRed: '#e09090',
                brightGreen: '#a0d49c',
                brightYellow: '#e0c080',
                brightBlue: '#98c4d0',
                brightMagenta: '#d0a8c8',
                brightCyan: '#98d0c0',
                brightWhite: '#f0e8d8',
            },
            fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
            fontSize: 12,
            lineHeight: 1.2,
            letterSpacing: 0,
            cursorBlink: true,
            cursorStyle: 'bar',
            allowProposedApi: true,
            convertEol: true,
            scrollback: 10000,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        requestAnimationFrame(() => {
            try {
                fitAddon.fit();
            } catch (e) { /* ignore */ }

            const cols = term.cols || 80;
            const rows = term.rows || 24;
            window.electronAPI.terminal.create(id, cols, rows, cwd);

            term.focus();
        });

        const onDataDispose = window.electronAPI.terminal.onData(id, (data) => {
            term.write(data);
        });

        const onTermDataDispose = term.onData((data) => {
            window.electronAPI.terminal.write(id, data);
        });

        const resizeObserver = new ResizeObserver(() => {
            if (fitAddonRef.current && xtermRef.current && terminalRef.current && terminalRef.current.clientWidth > 0) {
                try {
                    fitAddonRef.current.fit();
                    window.electronAPI.terminal.resize(id, xtermRef.current.cols, xtermRef.current.rows);
                } catch (e) { /* ignore */ }
            }
        });

        resizeObserver.observe(terminalRef.current);

        return () => {
            resizeObserver.disconnect();
            onDataDispose();
            onTermDataDispose.dispose();
            window.electronAPI.terminal.kill(id);
            term.dispose();
            initializedRef.current = false;
        };
    }, [id, cwd]);

    useEffect(() => {
        if (isActive && xtermRef.current && fitAddonRef.current && terminalRef.current) {
            const timer = setTimeout(() => {
                if (terminalRef.current && terminalRef.current.clientWidth > 0) {
                    try {
                        fitAddonRef.current.fit();
                        window.electronAPI.terminal.resize(id, xtermRef.current.cols, xtermRef.current.rows);
                    } catch (e) { /* ignore */ }
                }
                xtermRef.current?.focus();
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [isActive, id]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full overflow-hidden ${isActive ? 'block' : 'hidden'}`}
            onClick={handleClick}
            style={{ padding: '4px 8px' }}
        >
            <div ref={terminalRef} className="w-full h-full" />
        </div>
    );
}
