import React from 'react';
import HeroSection from '@/components/organizer-landing/HeroSection';
import SectionTwo from '@/components/organizer-landing/SectionTwo';
import SectionThree from '@/components/organizer-landing/SectionThree';
import SectionFour from '@/components/organizer-landing/SectionFour';
import PageWrapper from '@/components/page-wrapper';
const OrganizerPage: React.FC = () => {
  return (
    <PageWrapper className='p-5'>

    
          <HeroSection />

          <SectionTwo />
       
          <SectionThree />
    
          <SectionFour />
      
    </PageWrapper>
  );
};

export default OrganizerPage;