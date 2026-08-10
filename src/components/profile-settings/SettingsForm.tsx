import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface SettingsFormProps {
  user: ProfileFormValues & { memberSince?: string };
  onSave: (data: ProfileFormValues) => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ user, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      city: '',
    },
  });

  return (
    <div className="container mx-auto w-11/12 border border-[#E8E6E0] rounded-[20px] p-10 mb-18">
      <h2 className="font-[Schibsted Grotesk] font-semibold text-[#000000] text-[34px] leading-10 md:leading-1 tracking-[-2%] pb-6">
        Personal Information
      </h2>

      <form
        onSubmit={handleSubmit(onSave)}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
      >
        {/* Left column */}
        <div className="space-y-8">
          {/* Full Name */}
          <div className="flex flex-col items-start">
            <Label
              htmlFor="fullName"
              className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="eg. Ada Okafor"
              className="h-12 w-full placeholder:text-[16px] hover:bg-[#E4F1EB]"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col items-start">
            <Label
              htmlFor="email"
              className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="eg. ada@email.com"
              className="h-12 w-full placeholder:text-[16px] hover:bg-[#E4F1EB]"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Phone */}
          <div className="flex flex-col items-start">
            <Label
              htmlFor="phone"
              className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08012345678"
              className="h-12 w-full placeholder:text-[16px] hover:bg-[#E4F1EB]"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col items-start">
            <Label
              htmlFor="city"
              className="font-medium text-[16px] text-[#232323] tracking-[-0.03em]"
            >
              City
            </Label>
            <Input
              id="city"
              placeholder="eg. Lagos"
              className="h-12 w-full placeholder:text-[16px] hover:bg-[#E4F1EB]"
              {...register('city')}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Save button  */}
        <div className="md:col-span-2 mt-4 flex justify-start mb-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0F6E56] hover:bg-[#0d5c47] text-[#FFFFFF] font-medium px-6 py-2 rounded-md h-12 w-auto"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;