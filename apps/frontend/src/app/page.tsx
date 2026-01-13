'use client';

import Header from '@/components/home/Header';
import JackpotCard from '@/components/home/JackpotCard';
import RakebackCard from '@/components/home/RakebackCard';
import HouseEdgeCard from '@/components/home/HouseEdgeCard';
import RecentlyPlayedSection from '@/components/home/RecentlyPlayedSection';
import GamesGridSection from '@/components/home/GamesGridSection';
import BoomBalloonPromo from '@/components/home/BoomBalloonPromo';
import TrendingSection from '@/components/home/TrendingSection';
import LeaderboardSection from '@/components/home/LeaderboardSection';
import ChallengesSection from '@/components/home/ChallengesSection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div
      style={{
        position: 'relative',
        width: '1440px',
        minHeight: '1200px',
        margin: '0 auto',
        background: 'var(--gradient-bg)',
        fontFamily: 'var(--font-family)',
        color: 'var(--color-text-primary)',
        paddingBottom: '100px',
      }}
    >
      {/* Header Section */}
      <Header />

      {/* Top Cards Row */}
      <JackpotCard />
      <RakebackCard />
      <HouseEdgeCard />

      {/* Recently Played Section */}
      <RecentlyPlayedSection />

      {/* Boom Balloon Promo */}
      <BoomBalloonPromo />

      {/* Games Grid */}
      <GamesGridSection />

      {/* Trending Section */}
      <TrendingSection />

      {/* Leaderboard */}
      <LeaderboardSection />

      {/* Challenges */}
      <ChallengesSection />

      {/* Footer */}
      <Footer />

      {/* Decorative Glow Effects */}
      <div
        style={{
          position: 'absolute',
          width: '3px',
          height: '3px',
          left: '281px',
          top: '50px',
          background: '#D9D9D9',
          boxShadow: 'var(--shadow-teal-glow-lg)',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
