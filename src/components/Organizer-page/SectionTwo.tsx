import React from "react";
import { useEventFeatures } from "@/hooks/useEventData";
import { SECTION_TWO_FEATURES } from "@/lib/constants";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { PencilIcon, Coins, ScanLine, ZapIcon } from "lucide-react";

// Map icon names to Lucide components
const iconMap = {
  PencilIcon,
  Coins,
  ScanLine,
  ZapIcon,
};

const SectionTwo: React.FC = () => {
  // If you still want to fetch from API, you can use useEventFeatures
  // and map the data. Here we use the static constant for exact design match.
  const { data: features, isLoading, error } = useEventFeatures();

  // Use static data – but you can replace with features from API if needed
  const featureData = SECTION_TWO_FEATURES;

  if (isLoading) {
    return <SectionSkeleton type="features" />;
  }

  if (error) {
    console.warn("Using fallback data for Section Two:", error);
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Top badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#F5A524] h-1 w-6 md:w-8 rounded-[20px]"></span>
          <p className="text-[12px] font-bold text-[#0A4F41] leading-4 tracking-[16%] uppercase">
            EVERYTHING YOU NEED
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-extrabold text-2xl md:text-[34px] text-[#1A1523] leading-10 tracking-[-2px] mb-12">
          One dashboard, end to end
        </h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.id}
                className="flex flex-col items-start p-6 border border-[#E4F1EB] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-12 p-3 bg-[#F0F9F6] rounded-[10px]">
                  {IconComponent && (
                    <IconComponent
                      className="w-6 h-6 text-[#0F6E56]"
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <h3 className="text-[20px] font-bold text-[#1A1523] mb-2 leading-6 tracking-[-1%]">
                  {feature.title}
                </h3>
                <p className="text-[14px] font-medium text-[#4A4451] leading-5.25 tracking-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SectionTwo);

// import React from "react";
// import { useEventStats } from "@/hooks/useEventData";
// import { STATS_DATA, STATS_TITLE } from "@/lib/constants";
// import SectionSkeleton from "@/components/ui/SectionSkeleton";
// import { Card } from "@/components/ui/Card";

// const SectionTwo: React.FC = () => {
//   const { data: stats, isLoading, error } = useEventStats();

//   // Use fallback data if API fails
//   const statsData = stats?.length ? stats : STATS_DATA;

//   if (isLoading) {
//     return <SectionSkeleton type="stats" />;
//   }

//   if (error) {
//     console.warn("Using fallback data for Stats section:", error);
//   }

//   return (
//     <section className=" py-20 px-4 md:px-8 bg-white">
//       <div className="flex flex-col justify-start items-start max-w-6xl mx-auto">
//         <div className="flex flex-row justify-center items-center gap-3">
//           <span className="bg-[#F5A524] h-1 w-6 md:w-8 rounded-full"></span>
//           <p className="text-[12px] font-bold text-center text-[#0A4F41] mb-4 leading-4 tracking-[16%]">
//             EVERYTHING YOU NEED
//           </p>
//         </div>

//         <h1 className="font-extrabold text-2xl md:text-[34px] text-[#1A1523] mb-12 leading-10 tracking-[-2px]">
//           One dashboard, end to end
//         </h1>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {statsData.map((stat) => (
//             <Card key={stat.id} className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
//                 {stat.value}
//               </div>
//               <p className="text-sm text-gray-600">{stat.label}</p>
//               {stat.trend && (
//                 <span className="inline-block mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                   {stat.trend}
//                 </span>
//               )}
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default React.memo(SectionTwo);
