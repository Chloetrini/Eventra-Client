import React from 'react'
import { useFormContext } from 'react-hook-form'
import ImageUploader from '../ui/image-uploader'

const BasicsForm = () => {

    //    const {
    //     register,
    //     formState: { errors },
    // } = useFormContext<OnboardingValues>()

  return (
    <div>
      <ImageUploader
      label='COVER IMAGE'
      labelStyle='text-xs'
      previewStyle='h-[527px] rounded-[20px]'
      defaultStyle='h-[75px]'
      />
    </div>
  )
}

export default BasicsForm