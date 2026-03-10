import React, { useState, useEffect, useRef } from 'react';

const ProblemStatement = ({ problem, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [width, setWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const dragRef = useRef({ startX: 0, startWidth: 0 });
    const webviewRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        dragRef.current = {
            startX: e.clientX,
            startWidth: width
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = e.clientX - dragRef.current.startX;
            const newWidth = Math.max(300, Math.min(dragRef.current.startWidth + delta, 1200));
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        const handleStartLoading = () => setIsLoading(true);
        const handleStopLoading = () => setIsLoading(false);
        const handleDomReady = () => {
            setIsLoading(false);

            webview.setZoomFactor(0.85);

            const darkCSS = `
                html { 
                    filter: invert(100%) hue-rotate(180deg) !important;
                    background-color: #fff !important; /* Base for inversion */
                }
                /* Invert images and videos back so they look normal */
                img, video, iframe, canvas { 
                    filter: invert(100%) hue-rotate(180deg) !important; 
                }
                
                /* Selection fix */
                ::selection { background-color: #454a4d !important; color: #fff !important; }

                /* Still hide non-essential elements for a clean IDE view */
                #sidebar, #header, #footer, .header, .footer, .menu-box, .second-level-menu, .sidebox, #navigation { display: none !important; }
                .content-with-sidebar { margin-right: 0 !important; width: 100% !important; border: none !important; }
                #pageContent { margin: 0 !important; padding: 20px !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
                .roundbox { border: none !important; padding: 0 !important; box-shadow: none !important; }
                body { padding: 0 !important; margin: 0 !important; overflow-x: auto !important; }
            `;

            try {
                webview.insertCSS(darkCSS).catch(err => {
                    console.warn("Could not insert CSS (might be navigating):", err);
                });
            } catch (err) {
                console.warn("Error injecting CSS:", err);
            }
        };

        webview.addEventListener('did-start-loading', handleStartLoading);
        webview.addEventListener('did-stop-loading', handleStopLoading);
        webview.addEventListener('dom-ready', handleDomReady);

        return () => {
            webview.removeEventListener('did-start-loading', handleStartLoading);
            webview.removeEventListener('did-stop-loading', handleStopLoading);
            webview.removeEventListener('dom-ready', handleDomReady);
        };
    }, []);

    if (!problem) return null;

    return (
        <div
            className="flex flex-col bg-forge-surface border-r border-forge-border-subtle overflow-hidden relative z-30 shadow-2xl flex-shrink-0"
            style={{ width: `${width}px` }}
        >
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-forge-border-subtle bg-forge-surface/80 backdrop-blur-sm select-none">
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-[10px] font-bold text-forge-accent uppercase tracking-widest whitespace-nowrap">Problem View</span>
                    <div className="h-3 w-[1px] bg-forge-border-subtle" />
                    <span className="text-xs text-forge-text-muted truncate font-medium">{problem.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-forge-text-muted hover:text-forge-text transition-colors"
                        title="Open in external browser"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-forge-text-muted hover:text-forge-text transition-colors"
                        title="Close problem view"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Webview Area */}
            <div className="flex-1 bg-white relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-forge-surface z-40">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-2 border-forge-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] text-forge-text-muted uppercase tracking-[0.2em] animate-pulse">Loading Statement...</span>
                        </div>
                    </div>
                )}
                <webview
                    ref={webviewRef}
                    src={problem.url}
                    className="w-full h-full"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        visibility: isLoading ? 'hidden' : 'visible',
                        pointerEvents: isResizing ? 'none' : 'auto'
                    }}
                    useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    allowpopups="true"
                ></webview>

                {/* Resizer overlay while resizing */}
                {isResizing && <div className="absolute inset-0 z-50 cursor-col-resize" />}
            </div>

            {/* Resizer Handle */}
            <div
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-forge-accent/50 active:bg-forge-accent/80 transition-colors"
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};

export default ProblemStatement;
