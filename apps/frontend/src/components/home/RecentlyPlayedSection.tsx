'use client';

import GameCard from './GameCard';

const recentlyPlayedGames = [
    { id: 'coinflip', name: 'FLIP', image: '/images/games/coinflip.png' },
    { id: 'mines', name: 'MINES', image: '/images/games/mines.png', showContinue: true, favorite: true },
    { id: 'wheel', name: 'WHEEL', image: '/images/games/wheel.png' },
    { id: 'dice', name: 'DICE', image: '/images/games/dice.png' },
    { id: 'limbo', name: 'LIMBO', image: '/images/games/limbo.png' },
];

export default function RecentlyPlayedSection() {
    return (
        <>
            {/* Section Label */}
            <span
                style={{
                    position: 'absolute',
                    left: '32px',
                    top: '271px',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '14px',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                }}
            >
                Recently Played
            </span>

            {/* Game Cards */}
            <div
                style={{
                    position: 'absolute',
                    left: '32px',
                    top: '291px',
                    display: 'flex',
                    gap: '12px',
                }}
            >
                {recentlyPlayedGames.map((game, i) => (
                    <div
                        key={i}
                        style={{
                            width: '147px',
                            height: '187px',
                            border: '1px solid var(--color-border-card)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ padding: '12px' }}>
                            <GameCard
                                id={game.id}
                                name={game.name}
                                image={game.image}
                                showName={true}
                                showPlayers={false}
                                showContinue={game.showContinue}
                                favorite={game.favorite}
                                size="medium"
                            />
                        </div>
                    </div>
                ))}

                {/* Empty Slots */}
                {[0, 1].map((i) => (
                    <div
                        key={`empty-${i}`}
                        style={{
                            width: '147px',
                            height: '187px',
                            border: '1px dashed var(--color-border-card)',
                            borderRadius: '4px',
                        }}
                    />
                ))}
            </div>
        </>
    );
}
