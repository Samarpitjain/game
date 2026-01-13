'use client';

export default function Footer() {
    return (
        <footer
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                background: 'rgba(10, 10, 20, 0.95)',
                borderTop: '1px solid var(--color-border)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
            }}
        >
            {/* Left Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Login Button */}
                <button
                    style={{
                        padding: '8px 16px',
                        background: 'var(--color-border)',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        letterSpacing: '0.08em',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                    }}
                >
                    Login
                </button>

                {/* Sign Up Button */}
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'var(--color-accent-teal)',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        letterSpacing: '0.08em',
                        fontWeight: 500,
                        color: '#000000',
                        cursor: 'pointer',
                    }}
                >
                    <span>👤</span>
                    Sign up
                </button>

                {/* Trophy Button */}
                <button
                    style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--color-accent-orange)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <span style={{ fontSize: '18px' }}>🏆</span>
                </button>
            </div>

            {/* Center Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* User Info */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: 'var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--gradient-avatar)',
                        }}
                    />
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#FFFFFF' }}>RealBob</span>
                    <span
                        style={{
                            padding: '1px 4px',
                            background: 'var(--color-accent-orange)',
                            borderRadius: '2px',
                            fontSize: '8px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                        }}
                    >
                        VIP
                    </span>
                </div>

                {/* Game Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>🃏</span>
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                        Poker
                    </span>
                </div>

                {/* Balance */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        background: 'rgba(255, 0, 183, 0.2)',
                        borderRadius: '4px',
                    }}
                >
                    <span style={{ fontSize: '10px', color: '#FF0DB7' }}>💎</span>
                    <span style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#FF0DB7' }}>342 TRX</span>
                    <span
                        style={{
                            padding: '1px 3px',
                            background: 'rgba(255, 0, 183, 0.4)',
                            borderRadius: '2px',
                            fontSize: '7px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                        }}
                    >
                        12x
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Live Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-accent-green)',
                            borderRadius: '50%',
                        }}
                    />
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                        Live
                    </span>
                </div>

                {/* Action Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        📊
                    </button>
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        🔔
                    </button>
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        🌐
                    </button>
                </div>

                {/* Version */}
                <span
                    style={{
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        color: 'var(--color-border)',
                    }}
                >
                    v0.1.23
                </span>
            </div>
        </footer>
    );
}
