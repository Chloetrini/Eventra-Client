import React, { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { UserAvatar } from '@/components/ui/user-avatar';

export interface IProfile {
    fullName: string;
    email: string;
    memberSince: string;
    avatarUrl?: string;
}

interface ProfileHeaderProps {
    user: IProfile;
    onAvatarSelect?: (file: File) => void;
    isUploadingAvatar?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onAvatarSelect, isUploadingAvatar }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarSelect) {
            onAvatarSelect(file);
        }
        // Reset so picking the same file again still fires onChange
        e.target.value = '';
    };

    return (
        <div >
            {/* ACCOUNT label */}
            <div className="flex flex-row justify-start items-center gap-2.5 mb-10">
                <span className='bg-[#0F6E56] dark:bg-[#4ADE80] ml-1 h-[3px] w-[30px] sm:w-[20px] inline'></span>
                <p className="font-grotesk font-[600] text-[20px] md:text-[22px] text-[#0F6E56] dark:text-[#4ADE80] leading-7.5 tracking-[-1%]">
                     ACCOUNT
                </p>
            </div>

            {/* Title & description */}
            <div className="flex flex-col justify-center items-start gap-6 mt-4">
                <h1 className="font-grotesk font-[700] text-[30px] md:text-[64px] text-foreground leading-7.5 tracking-[-6%]">
                    Profile & Settings
                </h1>
                <p className="font-sans font-[700] text-muted-foreground  md:text-[18px] leading-7.25 tracking-[-3%]">
                    Update Your details, passwords, and how we reach you.
                </p>
            </div>

            {/* User info block */}
            <div className="mt-8 flex flex-col md:flex-row md:justify-center md:items-center gap-4 p-4 w-full h-auto md:h-37.25 bg-[#E4F1EB] dark:bg-[#0F6E56]/15 rounded-xl border border-border mb-14">

                <div className="flex flex-row items-center gap-4 md:gap-7.25 flex-1">

                    <div className="relative h-16 w-16 md:h-25.5 md:w-25.5 shrink-0">
                        <UserAvatar
                            avatarUrl={user.avatarUrl}
                            name={user.fullName}
                            className="h-16 w-16 md:h-25.5 md:w-25.5 text-[24px] md:text-[34px] font-[700] font-grotesk leading-1 tracking-[-2%] bg-[#0A4F41]"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            title="Change profile picture"
                            className="absolute bottom-0 right-0 h-7 w-7 md:h-8 md:w-8 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors disabled:opacity-60"
                        >
                            {isUploadingAvatar ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Camera className="h-3.5 w-3.5" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className='flex flex-col gap-4 mt-4                            '>
                        <p className="font-grotesk font-[600] text-[20px] md:text-[34px] text-foreground leading-1 tracking-[-2%]">
                            {user.fullName}
                        </p>
                        <p className="font-sans text-muted-foreground text-sm  font-[700] md:text-[18px]">
                            {user.email}
                        </p>
                    </div>

                </div>


                <p className="font-grotesk font-[500] text-muted-foreground uppercase text-[14px] md:text-[20px] mt-1 md:mt-0 md:ml-auto">
                    Member since {user.memberSince}
                </p>
            </div>
        </div>
    );
};

export default ProfileHeader;