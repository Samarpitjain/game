'use client';

import Link from 'next/link';
import Image from 'next/image';

interface GameCardProps {
    id: string;
    name: string;
    image: string;
    players?: string;
    badge?: string;
    showName?: boolean;
    showPlayers?: boolean;
    showContinue?: boolean;
    favorite?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function GameCard({
    id,
    name,
    image,
    players = '58.8K',
    badge,
    showName = true,
    showPlayers = true,
    showContinue = false,
    favorite = false,
    size = 'medium',
}: GameCardProps) {
    const sizes = {
        small: { width: 86, height: 114, footerHeight: 38 },
        medium: { width: 123, height: 163, footerHeight: 0 },
        large: { width: 147, height: 187, footerHeight: 0 },
    };

    const { width, height, footerHeight } = sizes[size];

    return (
        <Link
            href={`/game/${id}`}
            className="group"
            style={{
                display: 'block',
                textDecoration: 'none',
            }}
        >
            {/* Card Container */}
            <div
                style={{
                    position: 'relative',
                    width: `${width}px`,
                    height: `${height}px`,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: size === 'large' ? '1px solid var(--color-border-card)' : 'none',
                }}
            >
                {/* Game Image */}
                <Image
                    src={image}
                    alt={name}
                    fill
                    style={{
                        objectFit: 'cover',
                        filter: showContinue ? 'blur(3px) brightness(0.6)' : 'none',
                    }}
                />

                {/* Game Name Overlay */}
                {showName && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            fontWeight: 700,
                            fontSize: size === 'small' ? '14px' : '18px',
                            letterSpacing: '0.08em',
                            color: '#FFFFFF',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            textTransform: 'uppercase',
                        }}
                    >
                        {name}
                    </div>
                )}

                {/* Badge */}
                {badge && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            padding: '2px 6px',
                            background: 'var(--color-accent-orange)',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#FFFFFF',
                        }}
                    >
                        {badge}
                    </div>
                )}

                {/* Favorite Icon */}
                {favorite && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '14px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        ♥
                    </div>
                )}

                {/* Continue Button */}
                {showContinue && (
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            gap: '6px',
                            background: 'var(--color-accent-orange)',
                            borderRadius: '4px',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: '#FFFFFF' }}>▶</span>
                        <span
                            style={{
                                fontWeight: 500,
                                fontSize: '14px',
                                letterSpacing: '0.08em',
                                color: '#FFFFFF',
                            }}
                        >
                            Continue
                        </span>
                    </div>
                )}

                {/* Hover Play Button */}
                <div
                    className="play-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.6)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            gap: '6px',
                            background: 'var(--color-accent-orange)',
                            borderRadius: '4px',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: '#FFFFFF' }}>▶</span>
                        <span style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.08em', color: '#FFFFFF' }}>
                            Play
                        </span>
                    </div>
                </div>
            </div>

            {/* Player Count Footer (for small cards) */}
            {showPlayers && size === 'small' && (
                <div
                    style={{
                        width: `${width}px`,
                        height: `${footerHeight}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        marginTop: '0px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '11px', height: '10px', background: 'var(--color-text-secondary)' }} />
                        <span
                            style={{
                                fontSize: '12px',
                                letterSpacing: '0.08em',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {players}
                        </span>
                    </div>
                </div>
            )}

            <style jsx>{`
        .group:hover .play-overlay {
          opacity: 1 !important;
        }
      `}</style>
        </Link>
    );
}
