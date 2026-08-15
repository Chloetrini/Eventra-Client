import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ImageUploader from '../ui/image-uploader'
import { FormBox } from '../ui/form-box'
import type { EventFormValues } from '@/lib/schema'
import { fetchCategories, type EventCategory } from '@/lib/create-event-api'

type BasicsFormProps = {
  onUploadStatusChange?: (uploading: boolean) => void
}
const BasicsForm = ({ onUploadStatusChange }: BasicsFormProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormValues>()

  const [categories, setCategories] = useState<EventCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch(() => {
        if (!cancelled) setCategoriesError(true)
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // NOTE: options are the category *names* here, matching how FormBox's
  // select is used everywhere else in the wizard (flat string array, value
  // === label). This means the form will store the category NAME, not its
  // id — see the flag in chat about reconciling that with what the backend
  // (category: ObjectId) actually expects before this goes to Review.
  const categoryOptions = categories.map((category) => category.name)

  return (
    <div>
      <div className='flex flex-col gap-5'>
        <FormBox
          inputType='input'
          type='text'
          label='EVENT NAME'
          placeholder="Your event's name"
          id="eventName"
          errors={errors.title}
          name="title"
          classname="w-full"
          borderStyle="createEvent"
          register={register}
        />
        <div className='flex gap-5'>
          <div className='w-full'>
            <FormBox
              inputType="select"
              type="select"
              label="CATEGORY"
              placeholder={
                categoriesLoading
                  ? "Loading categories…"
                  : categoriesError
                  ? "Couldn't load categories"
                  : "Select category"
              }
              id="category"
              errors={errors.category}
              name="category"
              classname="w-full"
              borderStyle="createEvent"
              register={register}
              options={categoryOptions}
              disabled={categoriesLoading || categoriesError}
            />
            {categoriesError && (
              <p className="text-xs text-destructive mt-1">
                Couldn't load categories. Refresh the page to try again.
              </p>
            )}
          </div>
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
          onUploadStatusChange={onUploadStatusChange}
        />

      </div>
    </div>
  )
}

export default BasicsForm