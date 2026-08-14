import { FormBox } from '../ui/form-box'
import { useFormContext, useWatch } from 'react-hook-form'
import type { EventFormValues } from '@/lib/schema'

const FreeTicketsForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const hasRsvpLimit = useWatch({ control, name: 'hasRsvpLimit' })

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
                        type='text'
                        label='MAXIMUM SPOTS'
                        placeholder="e.g 200"
                        id="rsvpLimit"
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