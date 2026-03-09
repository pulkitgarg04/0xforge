import { useState } from 'react';

export default function OnboardingScreen({ onComplete }) {
    const [formData, setFormData] = useState({
        name: '',
        language: 'cpp',
        leetcode: '',
        codeforces: '',
        codechef: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setSubmitting(true);
        await window.electronAPI.setStore('userProfile', formData);
        onComplete(formData);
    };

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
                overflowY: 'auto',
            }}
        >
            <div style={{ width: '100%', maxWidth: '480px', padding: '40px 24px' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
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
                            Welcome to 0xForge
                        </h1>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#a09080', margin: '4px 0 0 0' }}>
                            Let's set up your <span style={{ fontStyle: 'normal' }}>competitive profile</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#a09080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: '#e8dcc8',
                                fontSize: '14px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid #3a3229',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#c8b89a'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#3a3229'; }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#a09080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Preferred Language <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                            required
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: '#1a1510',
                                color: '#e8dcc8',
                                fontSize: '14px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid #3a3229',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c8b89a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 16px top 50%',
                                backgroundSize: '12px auto'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#c8b89a'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#3a3229'; }}
                        >
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="c">C</option>
                            <option value="rust">Rust</option>
                            <option value="go">Go</option>
                            <option value="ruby">Ruby</option>
                            <option value="php">PHP</option>
                        </select>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#3a3229', width: '100%', margin: '8px 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a09080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Codeforces Handle</label>
                            <input
                                type="text"
                                placeholder="tourist"
                                value={formData.codeforces}
                                onChange={(e) => setFormData({ ...formData, codeforces: e.target.value })}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    color: '#e8dcc8',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #3a3229',
                                    outline: 'none',
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#c8b89a'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#3a3229'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a09080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LeetCode Handle</label>
                            <input
                                type="text"
                                placeholder="awice"
                                value={formData.leetcode}
                                onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    color: '#e8dcc8',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #3a3229',
                                    outline: 'none',
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#c8b89a'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#3a3229'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#a09080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CodeChef Handle</label>
                            <input
                                type="text"
                                placeholder="gennady"
                                value={formData.codechef}
                                onChange={(e) => setFormData({ ...formData, codechef: e.target.value })}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    color: '#e8dcc8',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #3a3229',
                                    outline: 'none',
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#c8b89a'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#3a3229'; }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!formData.name.trim() || submitting}
                        style={{
                            width: '100%',
                            marginTop: '24px',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: (!formData.name.trim() || submitting) ? '#4a4030' : '#c8b89a',
                            color: (!formData.name.trim() || submitting) ? '#8a7a60' : '#231d19ff',
                            fontWeight: 600,
                            fontSize: '14px',
                            border: 'none',
                            cursor: (!formData.name.trim() || submitting) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {submitting ? 'Saving...' : 'Onward to Forge'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#8a7a60', marginTop: '16px' }}>
                        You can change these later in Settings.
                    </p>
                </form>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
