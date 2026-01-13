'use client';

import Image from 'next/image';

const cryptoTabs = ['Bitcoin', 'Tron', 'Dash', 'Litecoin', 'Dogecoin', 'Tron', 'Dogecoin'];
const gameImages = [
    { src: '/images/games/plinko.png', opacity: 0.32 },
    { src: '/images/games/mines.png', opacity: 0.08 },
    { src: '/images/games/coinflip.png', opacity: 0.12 },
    { src: '/images/games/dice.png', opacity: 0.16 },
    { src: '/images/games/limbo.png', opacity: 0.32 },
    { src: '/images/games/pump.png', opacity: 1 },
];

export default function JackpotCard() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '6px',
                position: 'absolute',
                width: '592px',
                height: '106px',
                left: '32px',
                top: '133px',
            }}
        >
            {/* Card Box */}
            <div
                style={{
                    position: 'relative',
                    width: '592px',
                    height: '86px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}
            >
                {/* Game Thumbnails Strip */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '12px',
                        position: 'absolute',
                        left: '-107px',
                        top: '12px',
                        height: '62px',
                    }}
                >
                    {gameImages.map((game, i) => (
                        <div
                            key={i}
                            style={{
                                width: '48.22px',
                                height: '62px',
                                opacity: game.opacity,
                                borderRadius: '4px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <Image src={game.src} alt="game" fill style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>

                {/* Crypto Tabs */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px',
                        position: 'absolute',
                        left: '267px',
                        top: '18px',
                        height: '14px',
                    }}
                >
                    {cryptoTabs.map((coin, i) => (
                        <span
                            key={i}
                            style={{
                                fontWeight: i === 0 ? 600 : 300,
                                fontSize: '12px',
                                lineHeight: '14px',
                                letterSpacing: '0.08em',
                                color: i === 0 ? 'var(--color-accent-orange-light)' : '#FFFFFF',
                                opacity: i === 0 ? 1 : 0.24,
                            }}
                        >
                            {coin}
                        </span>
                    ))}
                </div>

                {/* BTC Amount */}
                <div
                    style={{
                        position: 'absolute',
                        left: '267px',
                        top: '39px',
                        borderBottom: '1px dashed var(--color-text-secondary)',
                        paddingBottom: '4px',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: '24px',
                            lineHeight: '29px',
                            letterSpacing: '0.08em',
                            color: '#FFFFFF',
                        }}
                    >
                        0.0021780 BTC
                    </span>
                </div>

                {/* Orange Glow */}
                <div
                    style={{
                        position: 'absolute',
                        width: '2px',
                        height: '3px',
                        left: '484px',
                        top: '56px',
                        background: '#D9D9D9',
                        boxShadow: 'var(--shadow-orange-glow)',
                        borderRadius: '4px',
                    }}
                />
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
                Jackpot!
            </span>
        </div>
    );
}
