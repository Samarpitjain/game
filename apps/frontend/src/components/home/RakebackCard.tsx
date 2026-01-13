'use client';

export default function RakebackCard() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '6px',
                position: 'absolute',
                width: '335px',
                height: '106px',
                left: '656px',
                top: '133px',
            }}
        >
            {/* Card Box */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px',
                    gap: '16px',
                    width: '335px',
                    height: '86px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                }}
            >
                {/* Top Row */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '311px',
                        height: '17px',
                    }}
                >
                    {/* Left - Percentage */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>🔥</span>
                            <span
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    letterSpacing: '0.08em',
                                    color: '#FFFFFF',
                                    borderBottom: '1px dashed var(--color-text-secondary)',
                                    paddingBottom: '2px',
                                }}
                            >
                                14.18%
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 3px',
                                gap: '4px',
                                background: 'var(--color-accent-green)',
                                borderRadius: '3px',
                            }}
                        >
                            <span style={{ fontSize: '10px', color: '#FFFFFF' }}>▲</span>
                            <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>23.1%</span>
                        </div>
                    </div>

                    {/* Right - See Boosts */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-accent-orange)' }}>←</span>
                        <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                            See Boosts
                        </span>
                        <span style={{ fontSize: '10px', color: '#555555' }}>→</span>
                    </div>
                </div>

                {/* Bottom Row */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '12px',
                        width: '311px',
                        height: '29px',
                    }}
                >
                    {/* Amount Box */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 12px',
                            flex: 1,
                            height: '29px',
                            background: 'var(--color-bg-button)',
                            borderRadius: '4px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px' }}>💳</span>
                            <span
                                style={{
                                    fontWeight: 300,
                                    fontSize: '14px',
                                    letterSpacing: '0.08em',
                                    color: 'var(--color-text-light)',
                                }}
                            >
                                5412.81 INR
                            </span>
                        </div>
                        <div
                            style={{
                                width: '10px',
                                height: '10px',
                                background: 'var(--color-accent-orange)',
                            }}
                        />
                    </div>

                    {/* Claim Button */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 12px',
                            width: '56px',
                            height: '29px',
                            background: 'var(--color-accent-orange)',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: '0.08em',
                                color: '#FFFFFF',
                            }}
                        >
                            Claim
                        </span>
                    </button>
                </div>
            </div>

            {/* Label */}
            <span
                style={{
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '14px',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                }}
            >
                Rakeback
            </span>
        </div>
    );
}
