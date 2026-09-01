import React from 'react';
import HeroSection from '@/components/organizer-landing/HeroSection';
import SectionTwo from '@/components/organizer-landing/SectionTwo';
import SectionThree from '@/components/organizer-landing/SectionThree';
import SectionFour from '@/components/organizer-landing/SectionFour';
import PageWrapper from '@/components/page-wrapper';
const OrganizerPage: React.FC = () => {
  return (
    <PageWrapper className="p-[20px] md:p-[40px] lg:p-[60px] xl:p-[80px] 2xl:p-[100px]">

    
          <HeroSection />

          <SectionTwo />
       
          <SectionThree />
    
          <SectionFour />
      
    </PageWrapper>
  );
};

export default OrganizerPage;