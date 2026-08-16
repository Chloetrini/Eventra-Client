
import { useState } from 'react';
import ProfileHeader from '@/components/profile-settings/ProfileHeader';
import SettingsForm from "@/components/profile-settings/SettingsForm";
import NToggles from '@/components/profile-settings/NToggles';
import ProfileSettingsSkeleton from '@/components/profile-settings/ProfileSettingsSkeleton';
import { useAuth, type User } from '@/context/auth.context';
import { toast } from 'react-toastify';
import PageWrapper from '@/components/page-wrapper';
import { updateProfile, uploadAvatar } from '@/services/user-api';
import { z } from 'zod';
import { profileSchema } from '@/lib/schema';

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, isLoading, setUser } = useAuth();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleSave = async (data: ProfileFormValues) => {
    try {
      // Email isn't updatable here (the backend doesn't accept it on this
      // endpoint) — only send the fields it actually supports.
      const updatedUser = await updateProfile({
        fullname: data.fullName,
        phone: data.phone,
        city: data.city,
      });
      // The endpoint already hands back the fresh user — write it straight
      // into the shared cache so the navbar/sidebar/this page all update
      // immediately, instead of relying on a second refetch round-trip.
      setUser(updatedUser as User);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    }
  };

  const handleAvatarSelect = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const updatedUser = await uploadAvatar(file);
      setUser(updatedUser as User);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  if (!user) {
    return (
      <div className="px-4 py-20 text-center text-muted-foreground">
        You need to be signed in to view your profile.
      </div>
    );
  }

const memberSince = typeof user.createdAt === "string"
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : '';

  return (
    <>

      <PageWrapper className='p-[20px]'>
          <ProfileHeader
            user={{
              fullName: user.fullname,
              email: user.email,
              memberSince,
              avatarUrl: user.avatarUrl,
            }}
            onAvatarSelect={handleAvatarSelect}
            isUploadingAvatar={isUploadingAvatar}
            />
          <SettingsForm
            user={{
              fullName: user.fullname,
              email: user.email,
              phone: typeof user.phone === "string" ? user.phone : undefined,
              city: typeof user.city === "string" ? user.city : undefined,
            }}
            onSave={handleSave}
            />
          <NToggles />

      </PageWrapper>

    </>
  );
}