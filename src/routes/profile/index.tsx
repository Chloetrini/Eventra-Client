import { Suspense } from 'react';
import { Seo as SEO } from "@/components/seo";
import SuspenseUI from "@/components/ui/suspense-ui";
import ProfileHeader from '@/components/profile-settings/ProfileHeader';
import SettingsForm from "@/components/profile-settings/SettingsForm";
import NToggles from '@/components/profile-settings/NToggles';
import ProfileSettingsSkeleton from '@/components/ProfileSettingsSkeleton';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from 'react-toastify';

// Interface matching your user shape so TypeScript knows fullName exists
interface UserProfile {
  fullName: string;
  email: string;
  memberSince?: string;
  phone?: string;
  city?: string;
}

// Type annotated fallback user data
const FALLBACK_USER: UserProfile = {
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

  //  Use the imported Skeleton component
  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  // If API fails, show a toast but continue with fallback
  if (error) {
    toast.error('Failed to load profile. Using default data.');
  }

  // Cast user so TypeScript doesn't infer it as {}
  const currentUser: UserProfile = (user as UserProfile) || FALLBACK_USER;

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
};