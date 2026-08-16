import { FormBox } from '../ui/form-box'
import { useFormContext, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import type { EventFormValues } from '@/services/schema'

const FreeTicketsForm = () => {
    const {
        register,
        control,
        resetField,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const hasRsvpLimit = useWatch({ control, name: 'hasRsvpLimit' })

    useEffect(() => {
        if (!hasRsvpLimit) {
            resetField("rsvpLimit", { defaultValue: undefined })
        }
    }, [hasRsvpLimit, resetField])

    return (
        <div className='flex flex-col gap-5'>
            <FormBox
                inputType='switch'
                type='switch'
                id="hasRsvpLimit"
                name="hasRsvpLimit"
                label="Limit Capacity"
                control={control}
                register={register}
                errors={errors.hasRsvpLimit}
                borderStyle='createEvent'
                switchInputClassName='data-[state=checked]:!bg-[#0F6E56]'
            />
            {hasRsvpLimit && (
                <div className='animate-in fade-in slide-in-from-top-2 duration-300 ease-out'>
                    <FormBox
                        inputType='input'
                        type='number'
                        label='MAXIMUM SPOTS'
                        placeholder="e.g 200"
                        id="rsvpLimit"
                        minValue={1}
                        errors={errors.rsvpLimit}
                        name="rsvpLimit"
                        classname="w-full"
                        borderStyle="createEvent"
                        register={register}
                    />
                </div>
            )}
        </div>
    )
}

export default FreeTicketsForm