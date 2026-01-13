'use client';

export default function Header() {
    return (
        <header
            style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px',
                gap: '64px',
                left: '32px',
                top: '28px',
                width: '1376px',
                height: '41px',
            }}
        >
            {/* Logo Section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '32px',
                    width: '163px',
                    height: '32px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '12px',
                        width: '111px',
                        height: '32px',
                    }}
                >
                    {/* Logo Circle */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            background: 'rgba(255, 255, 255, 0.16)',
                            borderRadius: '200px',
                            padding: '3px',
                        }}
                    >
                        <div
                            style={{
                                width: '26px',
                                height: '26px',
                                background: 'var(--color-accent-teal)',
                                borderRadius: '50%',
                                filter: 'drop-shadow(4px 2px 4px rgba(0, 0, 0, 0.3))',
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize: '19px',
                            lineHeight: '23px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        OREBIT
                    </span>
                </div>
            </div>

            {/* ~Play Text */}
            <span
                style={{
                    position: 'absolute',
                    left: '111px',
                    top: '29px',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '17px',
                    letterSpacing: '0.08em',
                    color: 'var(--color-accent-teal)',
                }}
            >
                ~Play
            </span>

            {/* Navigation Tabs */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    flex: 1,
                    height: '41px',
                }}
            >
                {/* Dashboard/Casino/Multiplayer */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        padding: '6px',
                        gap: '12px',
                        width: '326px',
                        height: '41px',
                        background: 'rgba(115, 255, 215, 0.06)',
                        borderRadius: '4px',
                    }}
                >
                    {/* Dashboard - Active */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            gap: '6px',
                            height: '29px',
                            background: 'var(--color-bg-button)',
                            borderRadius: '4px',
                        }}
                    >
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-accent-teal)' }} />
                        <span style={{ fontWeight: 400, fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>
                            Dashboard
                        </span>
                    </div>
                    {/* Casino */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', gap: '6px', height: '29px' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                            Casino
                        </span>
                    </div>
                    {/* Multiplayer */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', gap: '6px', height: '29px' }}>
                        <div style={{ width: '15px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                            Multiplayer
                        </span>
                    </div>
                </div>

                {/* Game Categories */}
                <div
                    style={{
                        position: 'relative',
                        width: '462px',
                        height: '41px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    {/* Blackjack - Active */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            position: 'absolute',
                            left: '12px',
                            top: '12px',
                        }}
                    >
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-accent-teal)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>Blackjack</span>
                    </div>
                    {/* Active Indicator */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '73px',
                            height: '1px',
                            left: '12px',
                            top: '39px',
                            background: 'var(--color-accent-teal)',
                            boxShadow: 'var(--shadow-indicator)',
                        }}
                    />
                    {/* Slots */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'absolute', left: '117px', top: '12px' }}>
                        <div style={{ width: '18px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>Slots</span>
                    </div>
                    {/* Poker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'absolute', left: '201px', top: '12px' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>Poker</span>
                    </div>
                    {/* Baccarat */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'absolute', left: '283px', top: '12px' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>Baccarat</span>
                    </div>
                    {/* Roulette */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'absolute', left: '384px', top: '12px' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>Roulette</span>
                    </div>
                    {/* Dividers */}
                    {[101, 185, 267, 368].map((left) => (
                        <div
                            key={left}
                            style={{
                                position: 'absolute',
                                width: '1px',
                                height: '16px',
                                left: `${left}px`,
                                top: '12px',
                                background: 'rgba(255, 255, 255, 0.12)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Spin Button */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        gap: '6px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    <div style={{ width: '12px', height: '12px', background: 'var(--color-accent-teal)' }} />
                    <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>Spin</span>
                </div>
                {/* Winner Button */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        gap: '6px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    <span style={{ fontSize: '12px' }}>👑</span>
                    <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>
                        Winner CrispyPotato 🎉
                    </span>
                </div>
            </div>

            {/* Decorative Elements */}
            {/* Header Line */}
            <div
                style={{
                    position: 'absolute',
                    width: '221px',
                    height: '1px',
                    left: '810px',
                    top: '53px',
                    background: 'var(--color-border)',
                }}
            />
            {/* Green Indicator */}
            <div
                style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    left: '887px',
                    top: '49px',
                    background: 'var(--color-accent-teal)',
                    boxShadow: 'var(--shadow-teal-glow)',
                    borderRadius: '50%',
                }}
            />
        </header>
    );
}
