'use client';

export default function HouseEdgeCard() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '6px',
                position: 'absolute',
                width: '385px',
                height: '105px',
                left: '1023px',
                top: '133px',
            }}
        >
            {/* Orange Glow Effect */}
            <div
                style={{
                    position: 'absolute',
                    width: '3px',
                    height: '3px',
                    left: '38px',
                    top: '27px',
                    background: '#D9D9D9',
                    boxShadow: 'var(--shadow-orange-glow-lg)',
                    borderRadius: '4px',
                }}
            />

            {/* Card Box */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px',
                    gap: '6px',
                    width: '385px',
                    height: '85px',
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
                        width: '361px',
                        height: '41px',
                    }}
                >
                    {/* Premium/VIP Tabs */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px',
                            gap: '12px',
                            background: 'var(--gradient-gold-transparent)',
                            borderRadius: '4px',
                        }}
                    >
                        {/* Premium - Active */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 12px',
                                gap: '6px',
                                background: 'var(--color-bg-button)',
                                borderRadius: '4px',
                            }}
                        >
                            <div
                                style={{
                                    width: '14px',
                                    height: '14px',
                                    background: 'var(--gradient-gold)',
                                    borderRadius: '50%',
                                }}
                            />
                            <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>Premium</span>
                        </div>
                        {/* VIP */}
                        <div style={{ display: 'flex', alignItems: 'center', padding: '6px 9px', gap: '6px' }}>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>💎</span>
                            <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                                VIP
                            </span>
                        </div>
                    </div>

                    {/* Percentage */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    background: 'var(--gradient-gold)',
                                }}
                            />
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
                                9.01%
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
                            <span style={{ fontSize: '10px', color: '#FFFFFF' }}>▼</span>
                            <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>18.6%</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <span
                    style={{
                        fontWeight: 300,
                        fontSize: '12px',
                        lineHeight: '14px',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                </span>
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
                House Edge
            </span>
        </div>
    );
}
