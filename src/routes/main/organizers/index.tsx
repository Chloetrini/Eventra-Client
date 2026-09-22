import React from 'react';
import HeroSection from '@/components/organizer-landing/hero-section';
import SectionTwo from '@/components/organizer-landing/section-two';
import SectionThree from '@/components/organizer-landing/section-three';
import SectionFour from '@/components/organizer-landing/section-four';
import PageWrapper from '@/components/layout/page-wrapper';
import { Reveal } from '@/components/shared/reveal';
const OrganizerPage: React.FC = () => {
  return (
    <PageWrapper className='p-5'>


          <HeroSection />

          <Reveal>
            <SectionTwo />
          </Reveal>

          <Reveal>
            <SectionThree />
          </Reveal>

          <Reveal>
            <SectionFour />
          </Reveal>

    </PageWrapper>
  );
};

export default OrganizerPage;
