import React from 'react';

interface SectionSkeletonProps {
  type?: 'hero' | 'stats' | 'features' | 'bonus' | 'cta';
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ type = 'hero' }) => {
  const skeletons = {
    hero: (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse mb-6 w-3/4 mx-auto" />
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse mb-8 w-2/3 mx-auto" />
          <div className="flex justify-center gap-4">
            <div className="h-14 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-14 w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    ),
    stats: (
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4 w-64 mx-auto" />
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-12 w-96 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-2 w-24 mx-auto" />
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    features: (
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4 w-80 mx-auto" />
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-12 w-96 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-2 w-32 mx-auto" />
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-48 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    bonus: (
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-32 mb-4" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4" />
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="flex gap-4">
                <div className="h-14 w-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-14 w-48 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    ),
    cta: (
      <div className="py-20 px-4 bg-linear-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-16 bg-white/20 rounded-lg animate-pulse mb-4 w-2/3 mx-auto" />
          <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-8 w-1/2 mx-auto" />
          <div className="h-14 w-56 bg-white/20 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>
    ),
  };

  return skeletons[type] || skeletons.hero;
};

export default SectionSkeleton;