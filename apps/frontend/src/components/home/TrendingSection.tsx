'use client';

export default function TrendingSection() {
    return (
        <div
            style={{
                position: 'absolute',
                left: '1069px',
                top: '504px',
            }}
        >
            {/* Trending Box */}
            <div
                style={{
                    position: 'relative',
                    width: '339px',
                    height: '50px',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* TRENDING Text with Gradient */}
                <span
                    style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        background: 'var(--gradient-trending)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    TRENDING
                </span>

                {/* Red Glow Effect */}
                <div
                    style={{
                        position: 'absolute',
                        width: '1px',
                        height: '16px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--color-accent-orange)',
                        boxShadow: 'var(--shadow-red-glow)',
                        borderRadius: '4px',
                    }}
                />
            </div>

            {/* Description */}
            <p
                style={{
                    marginTop: '24px',
                    width: '339px',
                    fontWeight: 300,
                    fontSize: '12px',
                    lineHeight: '14px',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-secondary)',
                }}
            >
                ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                odit aut fugit, sed quia consequun...
                <span style={{ color: 'var(--color-accent-orange-light)' }}>see more</span>
            </p>

            {/* ORBIT Originals Button */}
            <div
                style={{
                    marginTop: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px 6px',
                    gap: '6px',
                    width: 'fit-content',
                    background: 'rgba(255, 69, 0, 0.12)',
                    borderRadius: '3px',
                }}
            >
                <span style={{ width: '10px', height: '10px', background: 'var(--color-accent-orange)' }} />
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
        </div>
    );
}
