'use client';

import Image from 'next/image';

const gameImages = [
    'dice', 'mines', 'plinko', 'pump', 'limbo', 'coinflip', 'wheel', 'blackjack',
    'dice', 'mines', 'plinko', 'pump', 'limbo', 'coinflip', 'wheel',
];

export default function ChallengesSection() {
    return (
        <div
            style={{
                position: 'absolute',
                left: '32px',
                top: '950px',
                width: '1376px',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                }}
            >
                {/* Arrows */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        style={{
                            padding: '4px 8px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'transparent',
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        ‹
                    </button>
                    <button
                        style={{
                            padding: '4px 8px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'transparent',
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        ›
                    </button>
                </div>
                <span
                    style={{
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    Challenges
                </span>
                <span
                    style={{
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        color: 'var(--color-accent-teal)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                >
                    View All
                </span>
            </div>

            {/* Challenges Row */}
            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflow: 'hidden',
                }}
            >
                {/* Featured Challenge Card */}
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        background: 'var(--color-bg-card)',
                        borderRadius: '4px',
                        minWidth: '500px',
                    }}
                >
                    {/* Game Image */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                    >
                        <Image src="/images/games/pump.png" alt="Boom Balloon" fill style={{ objectFit: 'cover' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500, fontSize: '14px', color: '#FFFFFF' }}>Boom Balloon</span>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px 6px',
                                    gap: '4px',
                                    background: 'rgba(255, 69, 0, 0.12)',
                                    borderRadius: '2px',
                                }}
                            >
                                <span style={{ fontSize: '8px', color: 'var(--color-accent-orange)' }}>+</span>
                                <span style={{ fontSize: '10px', color: '#FFFFFF' }}>ORBEiT Originals</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-accent-orange)' }}>🔥</span>
                            <span style={{ fontSize: '12px', color: '#FFFFFF' }}>27.8K</span>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>~Winners</span>
                        </div>

                        <p
                            style={{
                                fontSize: '12px',
                                lineHeight: '14px',
                                letterSpacing: '0.08em',
                                color: 'var(--color-text-secondary)',
                                margin: '0 0 12px 0',
                            }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo conseq...{' '}
                            <span style={{ color: 'var(--color-accent-orange-light)' }}>see more</span>
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                style={{
                                    padding: '6px 12px',
                                    background: 'var(--color-accent-green)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Complete Challenge
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-accent-gold)' }}>₿</span>
                                <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#FFFFFF' }}>
                                    0.01000000 BTC
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blurred Background Games */}
                {gameImages.slice(0, 8).map((game, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'relative',
                            width: '86px',
                            height: '114px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            opacity: i === 0 ? 0.3 : 0.15,
                            filter: 'blur(2px)',
                            flexShrink: 0,
                        }}
                    >
                        <Image src={`/images/games/${game}.png`} alt={game} fill style={{ objectFit: 'cover' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
