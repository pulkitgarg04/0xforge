export function SectionHeader({ label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#4a4038' }} />
            <span style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#8a7a68',
            }}>
                {label}
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#4a4038' }} />
        </div>
    );
}
