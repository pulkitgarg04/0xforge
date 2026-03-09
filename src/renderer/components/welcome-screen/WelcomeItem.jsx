export function WelcomeItem({ icon, label, shortcut, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#d4c4a8',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3a3028';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a09080', opacity: 0.7 }}>
                {icon}
            </span>
            <span style={{ flex: 1, textAlign: 'left', fontSize: '13px' }}>{label}</span>
            {/* Depends on the OS (mac, windows, linux), will do it later */}
            {/* {shortcut && (
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#7a6a58' }}>
                    {shortcut}
                </span>
            )} */}
        </button>
    );
}
