'use client';

import Image from 'next/image';

const leaderboardData = [
    { rank: 1, name: 'RealBob', wins: 872, amount: '0.0024 BTC', badges: ['VIP'], isTop: true },
    { rank: 2, name: 'Kimchu', wins: 561, boostPercent: '+3.5%', isTop: true },
    { rank: 3, name: 'Samboxer', wins: 423, extra: '+2 more', isTop: true, hasGift: true },
    { rank: 4, name: 'Samboxer', wins: 202, rareAvatar: true, isTop: true },
    { rank: 5, name: 'Samboxer', wins: 202 },
    { rank: 6, name: 'Samboxer', wins: 202, rareAvatar: true },
    { rank: 7, name: 'Samboxer', wins: 202, rareAvatar: true },
    { rank: 8, name: 'Samboxer', wins: 202, rareAvatar: true },
    { rank: 9, name: 'Samboxer', wins: 202 },
];

export default function LeaderboardSection() {
    return (
        <div
            style={{
                position: 'absolute',
                left: '32px',
                top: '720px',
                width: '1376px',
            }}
        >
            {/* Header Row */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                }}
            >
                {/* Left Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Leaderboard Button */}
                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'transparent',
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                        }}
                    >
                        Leaderboard
                    </button>
                    {/* Contest Button - Active */}
                    <button
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'var(--color-accent-orange)',
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                        }}
                    >
                        Contest
                    </button>
                    {/* Wins Dropdown */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                        }}
                    >
                        <span style={{ fontSize: '14px', color: '#FFFFFF' }}>Wins</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>▼</span>
                    </div>
                    {/* Timer */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            background: 'rgba(255, 69, 0, 0.12)',
                            borderRadius: '4px',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: 'var(--color-accent-orange)' }}>⏱</span>
                        <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#FFFFFF' }}>4h: 32m: 21s</span>
                    </div>
                    {/* Prize Distribution */}
                    <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                        ~Prize Distribution
                    </span>
                </div>

                {/* Right Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Global Button - Active */}
                    <button
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'var(--color-accent-orange)',
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                        }}
                    >
                        Global
                    </button>
                    {/* Friends Button */}
                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'transparent',
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                        }}
                    >
                        Friends
                    </button>
                    {/* Period Selector */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {['D', 'W', 'M', 'Y'].map((period, i) => (
                            <button
                                key={period}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '4px',
                                    background: i === 1 ? 'var(--color-accent-orange)' : 'transparent',
                                    fontSize: '12px',
                                    color: i === 1 ? '#FFFFFF' : 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                }}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top 4 Players Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {leaderboardData.slice(0, 4).map((player, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '74px',
                            padding: '12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-card)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        {/* Rank */}
                        <div
                            style={{
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? '#CD7F32' : 'transparent',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: i < 3 ? '#000' : '#FFFFFF',
                            }}
                        >
                            {player.rank}
                        </div>

                        {/* Avatar */}
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--gradient-avatar)',
                            }}
                        />

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px', color: '#FFFFFF' }}>{player.name}</span>
                                {player.badges?.includes('VIP') && (
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
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>👤 💎 🎯</span>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>+4 more</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-accent-orange-light)' }}>
                                {player.wins} Wins
                            </span>
                            {player.amount && (
                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                    {player.amount}
                                </div>
                            )}
                            {player.boostPercent && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--color-accent-green)' }}>⚡</span>
                                    <span style={{ fontSize: '12px', color: 'var(--color-accent-green)' }}>
                                        {player.boostPercent} Boost
                                    </span>
                                </div>
                            )}
                            {player.hasGift && (
                                <span style={{ fontSize: '14px', color: 'var(--color-accent-orange)' }}>🎁</span>
                            )}
                            {player.rareAvatar && (
                                <div style={{ fontSize: '10px', color: 'var(--color-accent-orange-light)', marginTop: '4px' }}>
                                    ⭐ Rare Avatar
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
                {leaderboardData.slice(4, 9).map((player, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '54px',
                            padding: '8px 12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', width: '20px' }}>
                            {player.rank}.
                        </span>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'var(--gradient-avatar)',
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{player.name}</span>
                            <div style={{ fontSize: '8px', color: 'var(--color-text-secondary)' }}>👤 💎 🎯 +4 more</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{player.wins} Wins</span>
                            {player.rareAvatar && (
                                <div style={{ fontSize: '8px', color: 'var(--color-accent-orange-light)' }}>⭐ Rare Avatar</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
