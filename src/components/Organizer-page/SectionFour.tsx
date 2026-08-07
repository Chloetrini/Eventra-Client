import React from 'react';
import { Link } from 'react-router';
import { SECTION_FOUR_DATA } from '@/lib/organizer-constants';
import { Button } from '@/components/ui/button';

const SectionFour: React.FC = () => {
 

  const data = SECTION_FOUR_DATA;

 

  return (
    <section
      className="container mx-auto w-11/12 rounded-[10px] overflow-hidden relative py-20 px-4 md:px-16 my-28 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/background-image.png')",
      }}
    >
      <div />

      {/* Content – sits above the overlay */}
      <div className="relative z-10 text-start">
        <p className="text-[12px] font-bold text-[#F5A524] leading-4 tracking-[16%] uppercase">
          {data.badge}
        </p>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FFFFFF] leading-tight tracking-[-2px] mb-4">
          {data.title}
        </h2>

        <p className="text-base md:text-lg text-[#FFFFFF] mb-18 leading-relaxed md:w-160">
          {data.description}
        </p>

        <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
          <Link to={data.primaryButtonLink}>
            <Button
              variant="default"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-shadow bg-[#0F6E56] text-white hover:bg-[#0A4F41]"
            >
              {data.primaryButtonText}
            </Button>
          </Link>
          <Link to={data.secondaryButtonLink}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base bg-transparent font-semibold rounded-[10px] border-2 border-[#0F6E56] text-[#0F6E56]"
            >
              {data.secondaryButtonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SectionFour;






// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useEventCTA } from '@/hooks/useEventData';
// import { SECTION_FOUR_DATA } from '@/lib/organizer-constants';
// import SectionSkeleton from '@/components/ui/SectionSkeleton';
// import { Button } from '@/components/ui/button';


// const SectionFour: React.FC = () => {
//   const { isLoading, error } = useEventCTA();

//   const data = SECTION_FOUR_DATA;

//   if (isLoading) {
//     return <SectionSkeleton type="cta" />;
//   }

//   if (error) {
//     console.warn('Using fallback data for Section Four:', error);
//   }

//   return (
//     <section
//       className="relative py-20 px-4 md:px-16 bg-cover bg-center bg-no-repeat my-28"
//       style={{
//         backgroundImage: "url('/src/assets/background-image.png')",

//       }}
//     >
//       <div  />

//       {/* Content – sits above the overlay */}
//       <div className="relative z-10  mx-auto text-start"> 

//           <p className="text-[12px] font-bold text-[#F5A524] leading-4 tracking-[16%] uppercase">
//             {data.badge}
//           </p>
      

//         {/* Heading */}
//         <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FFFFFF] leading-tight tracking-[-2px] mb-4">
//           {data.title}
//         </h2>

//         {/* Description */}
//         <p className="text-base md:text-lg text-[#FFFFFF] mb-18 leading-relaxed md:w-160">
//           {data.description}
//         </p>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
//           <Link to={data.primaryButtonLink}>
//             <Button
//               variant="default"
//               size="lg"
//               className="px-8 py-6 text-base font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-shadow bg-[#0F6E56] text-white hover:bg-[#0A4F41]"
//             >
//               {data.primaryButtonText}
//             </Button>
//           </Link>
//           <Link to={data.secondaryButtonLink}>
//             <Button
//               variant="outline"
//               size="lg"
//               className="px-8 py-6 text-base bg-transparent font-semibold rounded-[10px] border-2 border-[#0F6E56] text-[#0F6E56]"
//             >
//               {data.secondaryButtonText}
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default React.memo(SectionFour);