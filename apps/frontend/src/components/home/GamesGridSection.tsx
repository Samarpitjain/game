'use client';

import Link from 'next/link';
import Image from 'next/image';

const games = [
    { id: 'dice', name: 'DICE', players: '58.8K', image: '/images/games/dice.png' },
    { id: 'mines', name: 'MINES', players: '58.8K', image: '/images/games/mines.png' },
    { id: 'plinko', name: 'PLINKO', players: '58.8K', image: '/images/games/plinko.png', badge: '7.0x' },
    { id: 'pump', name: 'PUMP', players: '27.8K', image: '/images/games/pump.png' },
    { id: 'limbo', name: 'LIMBO', players: '58.8K', image: '/images/games/limbo.png', badge: '800' },
    { id: 'plinko', name: 'PLINKO', players: '58.8K', image: '/images/games/plinko.png' },
    { id: 'dice', name: 'DICE', players: '58.8K', image: '/images/games/dice.png' },
    { id: 'mines', name: 'MINES', players: '58.8K', image: '/images/games/mines.png' },
];

export default function GamesGridSection() {
    return (
        <div
            style={{
                position: 'absolute',
                left: '32px',
                top: '504px',
            }}
        >
            {/* Controls Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                {/* Search Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        height: '26px',
                        padding: '0 12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            border: '1px solid var(--color-accent-teal)',
                            borderRadius: '50%',
                        }}
                    />
                    <span
                        style={{
                            fontSize: '12px',
                            letterSpacing: '0.08em',
                            color: 'var(--color-text-placeholder)',
                        }}
                    >
                        Search games...
                    </span>
                </div>

                {/* Filter Button */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '26px',
                        padding: '0 12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                    }}
                >
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>≡</span>
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                        Filter
                    </span>
                </div>

                {/* Sort By */}
                <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-inactive)' }}>
                    Sort By:{' '}
                    <span style={{ color: 'var(--color-accent-orange-light)', textDecoration: 'underline' }}>
                        Players Count
                    </span>
                </span>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Pagination */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '100px',
                            height: '4px',
                            background: 'var(--color-border)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ width: '30%', height: '100%', background: 'var(--color-text-muted)' }} />
                    </div>
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
                </div>
            </div>

            {/* Games Grid */}
            <div style={{ display: 'flex', gap: '24px' }}>
                {games.map((game, i) => (
                    <Link
                        key={i}
                        href={`/game/${game.id}`}
                        className="game-card-hover"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textDecoration: 'none',
                        }}
                    >
                        {/* Game Image */}
                        <div
                            style={{
                                position: 'relative',
                                width: '86px',
                                height: '114px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}
                        >
                            <Image src={game.image} alt={game.name} fill style={{ objectFit: 'cover' }} />

                            {/* Badge */}
                            {game.badge && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        padding: '2px 4px',
                                        background: 'var(--color-accent-orange)',
                                        borderRadius: '2px',
                                        fontSize: '8px',
                                        fontWeight: 600,
                                        color: '#FFFFFF',
                                    }}
                                >
                                    {game.badge}
                                </div>
                            )}

                            {/* Game Name Overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    left: '8px',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    letterSpacing: '0.08em',
                                    color: '#FFFFFF',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {game.name}
                            </div>

                            {/* Hover Overlay */}
                            <div
                                className="hover-overlay"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 8px',
                                        gap: '4px',
                                        background: 'var(--color-accent-orange)',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <span style={{ fontSize: '10px', color: '#FFFFFF' }}>▶</span>
                                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#FFFFFF' }}>Play</span>
                                </div>
                            </div>
                        </div>

                        {/* Player Count Footer */}
                        <div
                            style={{
                                width: '86px',
                                height: '38px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '11px', height: '10px', background: 'var(--color-text-secondary)' }} />
                                <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)' }}>
                                    {game.players}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx global>{`
        .game-card-hover:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
}
