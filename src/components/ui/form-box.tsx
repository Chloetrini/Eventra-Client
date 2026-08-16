import { cn } from '@/services/utils'
import { Eye, EyeClosed } from 'lucide-react'
import type { Control, FieldError as FieldErrorType, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form'

import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from './field'
import { Input } from './input'
import { Textarea } from './textarea'
import { DatePickerInput } from './date-picker-input'
import { TimePickerInput } from './time-picker-input'
import { SwitchInput } from './switch-input'
import { ImageUploadInput } from './image-upload-input'

type FormFieldProps<T extends FieldValues> = {
  label?: string
  type: string
  id: string
  register: UseFormRegister<T>
  errors?: FieldErrorType | undefined
  placeholder?: string
  isVisible?: boolean
  setIsVisible?: (visible: boolean | ((prev: boolean) => boolean)) => void
  name: Path<T>
  classname?: string
  disabled?: boolean
  defaultValue?: string | Date | number | boolean
  minValue?: number
  maxValue?: number
  inputType?: 'input' | 'textarea' | 'select' | 'switch' | 'datePicker' | 'time' | "imageUpload"
  registerOptions?: RegisterOptions<T>
  control?: Control<T>
  borderStyle?: 'checkout' | 'auth' | 'onboarding' | 'createEvent'
  options?: string[]
  dateInputClassName?: string
  timeInputClassName?: string
  timeFontSize?: number | string
  timeFontFamily?: string
  timeFontWeight?: number | string
  switchInputClassName?: string
  switchDescription?: string
  imageAccept?: string
  imagePreviewStyle?: string
  imageDefaultStyle?: string
  imageVariant?: 'default' | 'avatar'
  onImageFileSelected?: (file: File | null) => void
  onUploadStatusChange?: (uploading: boolean) => void
}

export function FormBox<T extends FieldValues>({
  isVisible,
  setIsVisible,
  label,
  type,
  placeholder,
  id,
  register,
  errors,
  name,
  classname,
  disabled = false,
  defaultValue,
  minValue,
  maxValue,
  inputType,
  registerOptions,
  borderStyle,
  options,
  dateInputClassName,
  timeInputClassName,
  timeFontSize,
  timeFontFamily,
  timeFontWeight,
  switchInputClassName,
  switchDescription,
  control,
  imageAccept,
  imagePreviewStyle,
  imageDefaultStyle,
  imageVariant,
  onImageFileSelected,
  onUploadStatusChange
}: FormFieldProps<T>) {
  const toggleVisibility = () => setIsVisible?.((prev: boolean) => !prev)

  const renderField = () => {
    switch (inputType) {
      case 'datePicker':
        if (!control) {
          throw new Error(`FormBox: "control" prop is required when inputType="datePicker" (field: ${String(name)})`)
        }
        return (
          <DatePickerInput
            id={id}
            name={name}
            control={control}
            placeholder={placeholder}
            disabled={disabled}
            borderStyle={borderStyle}
            errors={errors}
            inputClassName={dateInputClassName}
          />
        );
      case 'time':
        if (!control) {
          throw new Error(
            `FormBox: "control" prop is required when inputType="time" (field: ${String(name)})`
          )
        }

        return (
          <TimePickerInput
            name={name}
            control={control}
            disabled={disabled}
            errors={errors}
            borderStyle={borderStyle}
            defaultValue={
              defaultValue instanceof Date ? defaultValue : undefined
            }
            className={timeInputClassName}
            fontSize={timeFontSize}
            fontFamily={timeFontFamily}
            fontWeight={timeFontWeight}
          />
        );
      case 'imageUpload':
        if (!control) {
          throw new Error(
            `FormBox: "control" prop is required when inputType="imageUpload" (field: ${String(name)})`
          )
        }
        return (
          <ImageUploadInput
            name={name}
            control={control}
            label={label}
            accept={imageAccept}
            classname={classname}
            previewStyle={imagePreviewStyle}
            defaultStyle={imageDefaultStyle}
            placeholder={placeholder}
            errors={errors}
            variant={imageVariant}
            onFileSelected={onImageFileSelected}
            onUploadStatusChange={onUploadStatusChange}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={id}
            {...register(name, registerOptions)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(' md:py-5.5 resize-none', errors ? 'border-red-600' : '', borderStyle === 'checkout' ? 'border-[#AEAEB2] h-17.5 px-5 text-black' : borderStyle === 'auth' ? 'border-[#C3C9D3] h-15 px-3' : borderStyle === 'onboarding' ? "border-[#E8E6E0] h-14 px-15" : borderStyle === "createEvent" ? "border-border bg-background text-foreground h-11 p-2.5 rounded-[10px]" : 'px-3')}
            defaultValue={
              defaultValue instanceof Date
                ? defaultValue.toISOString().split('T')[0]
                : typeof defaultValue === 'boolean'
                  ? String(defaultValue)
                  : defaultValue
            }
            rows={4}
          />
        )
      case 'select':
        return (
          <select
            id={id}
            {...register(name, registerOptions)}
            disabled={disabled}
            defaultValue={
              defaultValue instanceof Date
                ? defaultValue.toISOString().split('T')[0]
                : typeof defaultValue === 'boolean'
                  ? String(defaultValue)
                  : (defaultValue ?? '')
            }
            className={cn(
              'w-full rounded-md border bg-transparent outline-none focus:outline-[#E4F1EB] focus:ring-3 focus:ring-[#E4F1EB] text-sm ',
              errors ? 'border-red-600' : '',
              borderStyle === 'checkout' ? 'border-[#AEAEB2] h-17.5 px-5 text-black' : borderStyle === 'auth' ? 'border-[#C3C9D3] h-15 px-3' : borderStyle === 'onboarding' ? "border-[#E8E6E0] h-14 px-12 " : borderStyle === "createEvent" ? "border-border bg-background text-foreground h-11 p-2.5 rounded-[10px]" : 'px-3'
            )}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'switch':
        if (!control) {
          throw new Error(`FormBox: "control" prop is required when inputType="switch" (field: ${String(name)})`)
        }
        return (
          <SwitchInput
            id={id}
            name={name}
            control={control}
            label={label}
            description={switchDescription}
            disabled={disabled}
            className={switchInputClassName}
          />
        )
      default:
        return (
          <div className="relative">
            <Input
              type={isVisible ? 'text' : type}
              placeholder={placeholder}
              className={cn('focus:outline-[#E4F1EB] focus:ring-[#E4F1EB] py-5.5', errors ? 'border-red-600' : '', borderStyle === 'checkout' ? 'border-[#AEAEB2] h-17.5 px-5 text-black' : borderStyle === 'auth' ? 'border-[#C3C9D3] h-15 px-3' : borderStyle === 'onboarding' ? "border-[#E8E6E0] h-14 px-15" : borderStyle === "createEvent" ? "border-border bg-background text-foreground h-11 p-2.5 rounded-[10px]" : 'px-3')}
              id={id}
              max={maxValue}
              min={minValue}
              {...register(name, registerOptions)}
              disabled={disabled}
              defaultValue={
                defaultValue instanceof Date
                  ? defaultValue.toISOString().split('T')[0]
                  : typeof defaultValue === 'boolean'
                    ? String(defaultValue)
                    : defaultValue
              }
            />
            {type === 'password' && (
              <button
                type="button"
                className="absolute top-[50%] right-2 text-xs border-0 focus:outline-none font-semibold cursor-pointer text-gray-700 w-fit"
                onClick={toggleVisibility}
              >
                {isVisible ? <Eye /> : <EyeClosed />}
              </button>
            )}
          </div>
        )
    }
  }

  return (
    <div className={`${classname}`}>
      <FieldSet>
        <FieldLegend className="w-full relative focus:outline-[#E4F1EB] focus:ring-[#E4F1EB]">
          <Field>
            {inputType !== 'switch' && inputType !== 'imageUpload' && (
              <FieldLabel htmlFor={id} className={cn('text-sm', errors ? 'text-destructive' : '')}>
                {label}
              </FieldLabel>
            )}
            {renderField()}
          </Field>
        </FieldLegend>
      </FieldSet>
      {inputType !== 'imageUpload' && errors?.message && (
        <FieldError className="text-xs text-destructive">{String(errors?.message)}</FieldError>
      )}
    </div>
  )
}