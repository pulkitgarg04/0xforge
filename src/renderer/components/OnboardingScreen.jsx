import { useState } from 'react';

export default function OnboardingScreen({ onComplete }) {
    const [formData, setFormData] = useState({
        name: '',
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
