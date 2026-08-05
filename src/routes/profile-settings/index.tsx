import { Suspense } from 'react';
import { Seo as SEO } from "@/components/seo";
import SuspenseUI from "@/components/ui/suspense-ui";
import ProfileHeader from '@/components/profile-settings/ProfileHeader';
import SettingsForm from "@/components/profile-settings/SettingsForm";
import NToggles from '@/components/profile-settings/NToggles';
// ✅ Import the new separate skeleton
import ProfileSettingsSkeleton from '@/components/ProfileSettingsSkeleton';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from 'react-toastify';

// Fallback user data (matches your API response shape)
const FALLBACK_USER = {
  fullName: ' ',
  email: ' ',
  memberSince: ' ',
  phone: ' ',
  city: ' ',
};

export default function SettingsPage() {
  const { data: user, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleSave = async (data: any) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // ✅ Use the imported Skeleton component
  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  // If API fails, show a toast but continue with fallback
  if (error) {
    toast.error('Failed to load profile. Using default data.');
  }

  // Use fallback if user is undefined/null
  const currentUser = user || FALLBACK_USER;

  return (
    <>
      <SEO title="Profile & Settings | EVENTRA" />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<SuspenseUI />}>
          <ProfileHeader
            user={{
              fullName: currentUser.fullName,
              email: currentUser.email,
              memberSince: currentUser.memberSince || '',
              initials: currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
            }}
          />
          <SettingsForm user={currentUser} onSave={handleSave} />
          <NToggles />
        </Suspense>
      </main>
    </>
  );
}





// import { Suspense } from 'react';
// import { Seo as SEO } from "@/components/seo";
// import SuspenseUI from "@/components/ui/suspense-ui";
// import ProfileHeader from '@/components/profile-settings/ProfileHeader';
// import SettingsForm from "@/components/profile-settings/SettingsForm";
// import NToggles from '@/components/profile-settings/NToggles';
// import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
// import { toast } from 'react-toastify';

// // Fallback user data (matches your API response shape)
// const FALLBACK_USER = {
//   fullName: ' ',
//   email: ' ',
//   memberSince: ' ',
//   phone: ' ',
//   city: ' ',
// };

// export default function SettingsPage() {
//   const { data: user, isLoading, error } = useProfile();
//   const updateProfile = useUpdateProfile();

//   const handleSave = async (data: any) => {
//     try {
//       await updateProfile.mutateAsync(data);
//       toast.success('Profile updated successfully!');
//     } catch (err) {
//       toast.error('Failed to update profile. Please try again.');
//     }
//   };

//   // Show loading only while fetching and no data yet
//   if (isLoading) {
//     return <div className="py-20 text-center">Loading profile...</div>;
//   }

//   // If API fails, show a toast but continue with fallback
//   if (error) {
//     toast.error('Failed to load profile. Using default data.');
//   }

//   // Use fallback if user is undefined/null
//   const currentUser = user || FALLBACK_USER;

//   return (
//     <>
//       <SEO title="Profile & Settings | EVENTRA" />
//       <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <Suspense fallback={<SuspenseUI />}>
//           <ProfileHeader
//             user={{
//               fullName: currentUser.fullName,
//               email: currentUser.email,
//               memberSince: currentUser.memberSince || '',
//               initials: currentUser.fullName
//                 .split(' ')
//                 .map((n) => n[0])
//                 .join('')
//                 .toUpperCase()
//                 .slice(0, 2),
//             }}
//           />
//           <SettingsForm user={currentUser} onSave={handleSave} />
//           <NToggles />
//         </Suspense>
//       </main>
//     </>
//   );
// }