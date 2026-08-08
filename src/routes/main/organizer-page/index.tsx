import React from 'react';
import HeroSection from '@/components/Organizer-page/HeroSection';
import SectionTwo from '@/components/Organizer-page/SectionTwo';
import SectionThree from '@/components/Organizer-page/SectionThree';
import SectionFour from '@/components/Organizer-page/SectionFour';
import PageWrapper from '@/components/pageWrapper';
const OrganizerPage: React.FC = () => {
  return (
    <PageWrapper className='p-[20px]'>

    
          <HeroSection />

          <SectionTwo />
       
          <SectionThree />
    
          <SectionFour />
      
    </PageWrapper>
  );
};

export default OrganizerPage;