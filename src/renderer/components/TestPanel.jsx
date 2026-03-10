import { useState, useEffect } from 'react';
import Icon from './Icon';
import { sampleTestCases as defaultTestCases } from '../constants';
import * as GeneralIcons from './icons/generalIcons';

export default function TestPanel({ testCases = defaultTestCases }) {
    const [activeTest, setActiveTest] = useState(1);

    useEffect(() => {
        if (testCases && testCases.length > 0) {
            setActiveTest(testCases[0].id);
        }
    }, [testCases]);

    const currentTest = testCases.find(t => t.id === activeTest) || testCases[0];

    useEffect(() => {
        const unsubscribe = window.electronAPI.onMenuAction((action) => {
            if (action === 'runTests' || action === 'runCode') {
                console.log(`Executing ${action} from menu...`);
                alert(`Executing ${action} (Not yet fully implemented)`);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="h-full bg-forge-surface flex flex-col">
            <div className="h-10 flex items-center justify-between px-5 border-b border-forge-border-subtle select-none">
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest">Test Cases</span>
                    <div className="flex gap-1">
                        {testCases.map((tc) => (
                            <button key={tc.id} onClick={() => setActiveTest(tc.id)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer
                                    ${activeTest === tc.id
                                        ? 'bg-forge-accent/15 text-forge-accent'
                                        : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-surface-hover'}`}>
                                {tc.status === 'passed' && <span className="text-forge-success mr-1.5">●</span>}
                                {tc.status === 'failed' && <span className="text-forge-error mr-1.5">●</span>}
                                {tc.status === 'idle' && <span className="text-forge-text-dim mr-1.5">●</span>}
                                Case {tc.id}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-forge-accent/15 text-forge-accent hover:bg-forge-accent/25 transition-colors flex items-center gap-2 cursor-pointer">
                        <Icon d={GeneralIcons.play} size={11} />
                        Run All
                    </button>
                </div>
            </div>

            {currentTest && (
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 p-4 border-r border-forge-border-subtle overflow-auto">
                        <div className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest mb-2.5">Input</div>
                        <pre className="text-xs font-mono text-forge-text bg-forge-bg rounded-lg p-3.5 leading-5 whitespace-pre-wrap">{currentTest.input}</pre>
                    </div>
                    <div className="flex-1 p-4 border-r border-forge-border-subtle overflow-auto">
                        <div className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest mb-2.5">Expected</div>
                        <pre className="text-xs font-mono text-forge-text bg-forge-bg rounded-lg p-3.5 leading-5 whitespace-pre-wrap">{currentTest.expected}</pre>
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <div className="text-[11px] font-semibold text-forge-text-muted uppercase tracking-widest mb-2.5">Output</div>
                        <pre className={`text-xs font-mono rounded-lg p-3.5 leading-5 whitespace-pre-wrap
                            ${currentTest.status === 'passed' ? 'text-forge-success bg-forge-success/5' :
                                currentTest.status === 'failed' ? 'text-forge-error bg-forge-error/5' :
                                    'text-forge-text-dim bg-forge-bg'}`}>{currentTest.status === 'passed' ? currentTest.expected :
                                        currentTest.status === 'failed' ? 'Wrong Answer' : '—'}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}
