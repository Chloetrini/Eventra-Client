import React from 'react';

export interface IProfile {
    fullName: string;
    email: string;
    memberSince: string;
    initials: string;
}

interface ProfileHeaderProps {
    user: IProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <div className="container mx-auto w-11/12">
            {/* ACCOUNT label */}
            <div className="flex flex-row justify-start items-center gap-2.5 mb-10">
                <span className='bg-[#0F6E56] ml-1 h-1 w-4 sm:h-1 sm:w-6 inline'></span>
                <p className="font-[Schibsted Grotesk] font-semibold text-[20px] md:text-[22px] text-[#0F6E56] leading-7.5 tracking-[-1%]">
                     ACCOUNT
                </p>
            </div>

            {/* Title & description */}
            <div className="flex flex-col justify-center items-start gap-6 mt-4">
                <h1 className="font-[Schibsted Grotesk] font-bold text-[40px] md:text-[64px] text-[#000000] leading-7.5 tracking-[-6%]">
                    Profile & Settings
                </h1>
                <p className="font-[Geist] font-medium text-[#6E6577] text-[18px] leading-7.25 tracking-[-3%]">
                    Update Your details, passwords, and how we reach you.
                </p>
            </div>

            {/* User info block */}
            <div className="mt-8 flex flex-col md:flex-row md:justify-center md:items-center gap-4 p-4 w-full h-auto md:h-37.25 bg-[#E4F1EB] rounded-xl border border-gray-200 mb-14">
              
                <div className="flex flex-row items-center gap-4 md:gap-7.25 flex-1">

                    <div className="h-16 w-16 md:h-25.5 md:w-25.5 rounded-full bg-[#0A4F41] flex items-center justify-center text-[#FFFFFF] text-[24px] md:text-[34px] font-bold font-[Schibsted Grotesk] leading-1 tracking-[-2%]">
                        {user.initials}
                    </div>

                    <div className='flex flex-col gap-4 mt-4                            '>  
                        <p className="font-[Schibsted Grotesk] font-semibold text-[24px] md:text-[34px] text-[#000000] leading-1 tracking-[-2%]">
                            {user.fullName}
                        </p>
                        <p className="font-[Geist] text-[#6E6577] text-sm md:text-base">
                            {user.email}
                        </p>
                    </div>

                </div>

               
                <p className="font-[Schibsted Grotesk] font-medium text-[#4A4451] uppercase text-sm md:text-[20px] mt-1 md:mt-0 md:ml-auto">
                    Member since {user.memberSince}
                </p>
            </div>
        </div>
    );
};

export default ProfileHeader;