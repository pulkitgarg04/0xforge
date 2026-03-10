import { useState } from 'react';
import Icon from './Icon';
import * as GeneralIcons from './icons/generalIcons';

export default function CodeforcesPanel({ onFetchProblem }) {
    const [problemId, setProblemId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetch = async (e) => {
        if (e) e.preventDefault();
        if (!problemId.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const result = await window.electronAPI.codeforces.fetchProblem(problemId);
            if (result.success) {
                onFetchProblem(result.data);
                setProblemId('');
            } else {
                setError(result.error || 'Failed to fetch problem');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-forge-surface p-4 gap-4 overflow-y-auto w-64 border-r border-forge-border-subtle">
            <div className="flex flex-col gap-2">
                <h3 className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest">Codeforces</h3>
                <p className="text-xs text-forge-text-dim leading-relaxed">
                    Input a problem ID (e.g., <code className="text-forge-accent">1941A</code>) or a Codeforces URL.
                </p>
            </div>

            <form onSubmit={handleFetch} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                    <input
                        type="text"
                        placeholder="e.g. 1941A or URL"
                        value={problemId}
                        onChange={(e) => setProblemId(e.target.value)}
                        className="bg-forge-bg border border-forge-border-subtle rounded-md px-3 py-2 text-xs text-forge-text outline-none focus:border-forge-accent transition-colors"
                    />
                </div>
                <button
                    disabled={loading || !problemId.trim()}
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-forge-accent/15 text-forge-accent hover:bg-forge-accent/25 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-3 w-3 text-forge-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching...
                        </span>
                    ) : (
                        <>
                            <Icon d={GeneralIcons.code} size={14} />
                            Fetch Problem
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="p-3 rounded-md bg-forge-error/10 border border-forge-error/20 text-forge-error text-xs leading-5">
                    {error}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-forge-border-subtle">
                <h4 className="text-[10px] font-bold text-forge-text-muted uppercase tracking-widest mb-3">Recent Challenges</h4>
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => { setProblemId('https://codeforces.com/problemset/problem/2207/G'); }}
                        className="text-left py-1.5 px-2 hover:bg-forge-surface-hover rounded text-[11px] text-forge-text-dim hover:text-forge-text transition-colors"
                    >
                        2207G - Example Problem
                    </button>
                    <button
                        onClick={() => { setProblemId('1941A'); }}
                        className="text-left py-1.5 px-2 hover:bg-forge-surface-hover rounded text-[11px] text-forge-text-dim hover:text-forge-text transition-colors"
                    >
                        1941A - Rudolf and the Ticket
                    </button>
                    <button className="text-left py-1.5 px-2 hover:bg-forge-surface-hover rounded text-[11px] text-forge-text-dim hover:text-forge-text transition-colors text-forge-accent font-medium">
                        Browse all problems →
                    </button>
                </div>
            </div>
        </div>
    );
}
