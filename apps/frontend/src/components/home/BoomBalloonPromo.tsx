'use client';

import Image from 'next/image';

export default function BoomBalloonPromo() {
    return (
        <div
            style={{
                position: 'absolute',
                left: '1069px',
                top: '291px',
                width: '339px',
                height: '187px',
                background: 'var(--color-bg-card)',
                borderRadius: '4px',
                padding: '18px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    Boom Balloon
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '11px', height: '10px', background: 'var(--color-accent-orange)' }} />
                    <span
                        style={{
                            fontSize: '12px',
                            letterSpacing: '0.08em',
                            color: '#FFFFFF',
                            textDecoration: 'underline',
                        }}
                    >
                        58.8K
                    </span>
                </div>
            </div>

            {/* Description */}
            <p
                style={{
                    fontWeight: 300,
                    fontSize: '12px',
                    lineHeight: '14px',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-lighter)',
                    margin: 0,
                }}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis n...{' '}
                <span style={{ color: 'var(--color-accent-orange-light)' }}>see more</span>
            </p>

            {/* Button */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px 6px',
                    gap: '6px',
                    width: 'fit-content',
                    background: 'var(--color-accent-orange)',
                    borderRadius: '3px',
                }}
            >
                <span style={{ width: '10px', height: '10px', background: '#FFFFFF', borderRadius: '2px' }} />
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        color: '#FFFFFF',
                    }}
                >
                    ORBEiT Originals
                </span>
            </div>

            {/* Game Image Preview (positioned slightly outside) */}
            <div
                style={{
                    position: 'absolute',
                    left: '-40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '80px',
                    height: '100px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    opacity: 0.8,
                }}
            >
                <Image src="/images/games/pump.png" alt="Boom Balloon" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
    );
}
