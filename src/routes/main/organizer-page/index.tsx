import React, { Suspense, lazy } from 'react';
import type { SeoHandle } from '@/components/seo';
import ErrorBoundary  from '@/components/error-boundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HeroSection from '@/components/Organizer-page/HeroSection';

// Lazy load components
const HeroSec = lazy(() => import('@/components/Organizer-page/HeroSection'));
const SectionTwo = lazy(() => import('@/components/Organizer-page/SectionTwo'));
const SectionThree = lazy(() => import('@/components/Organizer-page/SectionThree'));
const SectionFour = lazy(() => import('@/components/Organizer-page/SectionFour'));

// SEO configuration
export const handle: SeoHandle = {
  seo: {
    title: 'Sell Tickets. Get Paid. No Stress.',
    description:
      'Start selling tickets for your events today. Complete event management dashboard with instant payments. No stress, just results.',
    image: '/og-image.jpg',
    url: '/',
  },
};

// Loading fallback – MUST return JSX
const SectionLoader: React.FC = () => {
  return (
    <div className="min-h-100 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

const OrganizerPage: React.FC = () => {
  return (
    <main className='mx-auto container w-11/12'>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <SectionTwo />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <SectionThree />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <SectionFour />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default OrganizerPage;