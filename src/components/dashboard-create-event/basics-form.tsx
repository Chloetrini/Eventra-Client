import { useFormContext } from 'react-hook-form'
import ImageUploader from '../ui/image-uploader'
import { FormBox } from '../ui/form-box'
import type { EventFormValues } from '@/lib/schema'

const BasicsForm = () => {

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormValues>()

  return (
    <div>
      <div className='flex flex-col gap-5'>
        <FormBox
          inputType='input'
          type='text'
          label='EVENT NAME'
          placeholder="Your event's name"
          id="eventName"
          errors={errors.eventName}
          name="eventName"
          classname="w-full"
          borderStyle="createEvent"
          register={register}
        />
        <div className='flex gap-5'>
          <FormBox
            inputType="select"
            type="select"
            label="CATEGORY"
            placeholder="Select category"
            id="category"
            errors={errors.category}
            name="category"
            classname="w-full"
            borderStyle="createEvent"
            register={register}
            options={["Concerts", "Parties", "Conferences", "Comedy", "Sports", "Arts & Theatre", "Food & Drink", "Tech"]}
          />
          <FormBox
            inputType='datePicker'
            type='text'
            label='EVENT DATE'
            id="date"
            name="date"
            errors={errors.date}
            register={register}
            control={control}
            classname="w-full"
            borderStyle="createEvent"
            dateInputClassName='h-11'
          />
        </div>
        <div className='flex gap-5'>
          <FormBox
            inputType="time"
            type="time"
            label="START TIME"
            id="startTime"
            name="startTime"
            control={control}
            register={register}
            errors={errors.startTime}
            timeInputClassName="h-11"
            timeFontSize={14}
            classname='w-full'
            borderStyle='createEvent'
          />
          <FormBox
            inputType="time"
            type="time"
            label="END TIME"
            id="endTime"
            name="endTime"
            control={control}
            register={register}
            errors={errors.endTime}
            timeInputClassName=" h-11"
            timeFontSize={15}
            classname=' w-full'
            borderStyle='createEvent'
          />
        </div>
      </div>

      <FormBox
        inputType="textarea"
        type="textarea"
        label="DESCRIPTION"
        placeholder="Tell attendees what to expect"
        id="description"
        errors={errors.description}
        name="description"
        classname="w-full"
        borderStyle="createEvent"
        register={register}
      />

      <div>
        <FormBox
          inputType='imageUpload'
          type='text'
          label='COVER IMAGE'
          id="coverImage"
          name="coverImage"
          errors={errors.coverImage}
          control={control}
          register={register}
          imagePreviewStyle='h-[527px] rounded-[20px]'
          imageDefaultStyle='h-[75px] hover:bg-[#E4F1EB]'
          placeholder='Drag a cover image or click to upload'
        />

      </div>
    </div>
  )
}

export default BasicsForm