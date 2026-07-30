import { cn } from '@/lib/utils'
import { Eye, EyeClosed } from 'lucide-react'
import type { Control, FieldError as FieldErrorType, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from './field'
import { Input } from './input'
import { Textarea } from './textarea'

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
  inputType?: 'input' | 'textarea' | 'select' | 'switch'
  registerOptions?: RegisterOptions<T>
  control?: Control<T>
  borderStyle?: 'checkout' | 'auth'
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
  inputType,
  registerOptions,
  borderStyle,
  // control,
}: FormFieldProps<T>) {
  const toggleVisibility = () => setIsVisible?.((prev: boolean) => !prev)

  const renderField = () => {
    switch (inputType) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            {...register(name, registerOptions)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn('focus:outline-blue-500 focus:ring-blue-500', errors ? 'border-red-600' : '')}
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
      default:
        return (
          <div className="relative">
            <Input
              type={isVisible ? 'text' : type}
              placeholder={placeholder}
              className={cn('focus:outline-blue-500 focus:ring-blue-500 py-5.5', errors ? 'border-red-600' : ''  , borderStyle === 'checkout' ? ' border-[#AEAEB2] h-17.5 px-5 text-black': borderStyle === 'auth' ? 'border-[#C3C9D3] h-14' : '')}
              id={id}
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
        <FieldLegend className="w-full relative">
          <Field>
            <FieldLabel htmlFor={id} className={cn('text-sm', errors ? 'text-destructive' : '')}>
              {label}
            </FieldLabel>
            {renderField()}
          </Field>
        </FieldLegend>
      </FieldSet>
      {errors?.message && <FieldError className="text-xs text-destructive">{String(errors?.message)}</FieldError>}
    </div>
  )
}