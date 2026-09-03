import React from 'react';
import HeroSection from '@/components/organizer-landing/HeroSection';
import SectionTwo from '@/components/organizer-landing/SectionTwo';
import SectionThree from '@/components/organizer-landing/SectionThree';
import SectionFour from '@/components/organizer-landing/SectionFour';
import PageWrapper from '@/components/page-wrapper';
import { Reveal } from '@/components/ui/Reveal';
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
