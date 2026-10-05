import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import Hero from './books/Hero';
import CollectionCards from './books/CollectionCards';
import FeaturesGrid from './books/FeaturesGrid';
import HowToUse from './books/HowToUse';
import ScriptureTimeline from './books/ScriptureTimeline';
import ComparisonSection from './books/ComparisonSection';
import OneMission from './books/OneMission';
import PricingCards from './books/PricingCards';
import TestimonialsCarousel from './books/TestimonialsCarousel';
import FinalCTA from './books/FinalCTA';

export default function Books() {
  const { hash } = useLocation();

  useSEO({
    title: 'Books | In Him Daily',
    description: 'Explore the In Him Daily devotional book collections for adults, teens, and children — three series, three generations, one Jesus.',
    canonicalPath: '/books',
  });

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [hash]);

  return (
    <div className="relative min-h-screen text-white">
      <main>
        <Hero />
        <CollectionCards />
        <FeaturesGrid />
        <HowToUse />
        <ScriptureTimeline />
        <ComparisonSection />
        <OneMission />
        <PricingCards />
        <TestimonialsCarousel />
        <FinalCTA />
      </main>
    </div>
  );
}
