import { useEffect } from 'react'
import type { EventFormValues } from '@/lib/schema'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormBox } from '../ui/form-box'
import LocationMap from './location-map'
import mapPin from '@/assets/map-pin.png'
import { nigerianStates } from "@/lib/constants"


const LocationForm = () => {

    const {
        register,
        control,
        watch,
        resetField,
        formState: { errors },
    } = useFormContext<EventFormValues>()

    const locationType = useWatch({ control, name: 'locationType' })
    const address = useWatch({ name: 'address' })
    const venue = useWatch({ name: 'venueName' })
    const city = useWatch({ name: 'city' })
    const state = useWatch({ name: 'state' })

    const mapPrompt = (address && venue && city && state)

    useEffect(() => {
        if (locationType === 'physical') {
            resetField('onlinePlatform', { defaultValue: '' })
            resetField('onlineJoinLink', { defaultValue: '' })
        } else if (locationType === 'online') {
            resetField('venueName', { defaultValue: '' })
            resetField('address', { defaultValue: '' })
            resetField('city', { defaultValue: '' })
            resetField('state', { defaultValue: '' })
        }
    }, [locationType, resetField])

    return (
        <div>
            {locationType === 'physical' && (
                <div className='flex flex-col gap-5'>
                    <FormBox
                        inputType='input'
                        type='text'
                        label='VENUE NAME'
                        placeholder="e.g Muri Oriola Park"
                        id="venueName"
                        errors={errors.venueName}
                        name="venueName"
                        classname="w-full"
                        borderStyle="createEvent"
                        register={register}
                    />
                    <FormBox
                        inputType='input'
                        type='text'
                        label='ADDRESS'
                        placeholder="1 Ogunlesi St, off Awoyokun Stree..."
                        id="address"
                        errors={errors.address}
                        name="address"
                        classname="w-full"
                        borderStyle="createEvent"
                        register={register}
                    />

                    <div className='w-full flex flex-col sm:flex-row gap-5'>
                        <FormBox
                            inputType='input'
                            type='text'
                            label='CITY'
                            placeholder="Onipanu"
                            id="city"
                            errors={errors.city}
                            name="city"
                            classname="w-full"
                            borderStyle="createEvent"
                            register={register}
                        />
                        <FormBox
                            inputType='select'
                            type='select'
                            label='STATE'
                            placeholder="select state"
                            id="state"
                            errors={errors.state}
                            name="state"
                            classname="w-full"
                            borderStyle="createEvent"
                            register={register}
                            control={control}
                            options={nigerianStates}
                        />
                    </div>

                    {(!mapPrompt) && (
                        <div className='w-full h-[118px] bg-[#E4F1EB] dark:bg-[#0F6E56]/15 border border-border flex items-center justify-center animate-in fade-in slide-in-from-top-2 duration-300 ease-out mt-2'>
                            <div className='flex gap-2'>
                                <img src={mapPin} alt="" className='w-[19px] h-[19px]' />
                                <p className='text-sm text-muted-foreground'>Map preview pin shows here</p>
                            </div>
                        </div>
                    )}

                    {(mapPrompt) && (
                        <div className='animate-in fade-in slide-in-from-top-2 duration-300 ease-out mt-2'>
                            <LocationMap
                                name={venue}
                                address={address}
                                // mapQuery={address}
                                openLabel='Open in Google Maps'
                                className='border border-border'
                                cardClassName='hidden'
                            />
                        </div>
                    )}
                </div>
            )}

            {locationType === 'online' && (
                <div className='flex flex-col gap-5'>
                    <FormBox
                        inputType='select'
                        type='select'
                        label='PLATFORM'
                        placeholder="Select Platform"
                        id="platform"
                        errors={errors.onlinePlatform}
                        name="onlinePlatform"
                        classname="w-full"
                        borderStyle="createEvent"
                        register={register}
                        options={["Zoom", "Google Meet", "Microsoft Teams", "Webex", "Discord", "Other"]}
                        control={control}
                    />
                    <FormBox
                        inputType='input'
                        type='text'
                        label='JOIN LINK'
                        placeholder="https://..."
                        id="link"
                        errors={errors.onlineJoinLink}
                        name="onlineJoinLink"
                        classname="w-full"
                        borderStyle="createEvent"
                        register={register}
                    />
                    <div className='w-full bg-[#E4F1EB] dark:bg-[#0F6E56]/15 p-2.5 rounded-[5px]'>
                        <p className='text-[14px] text-muted-foreground'>🔗 The join link is only revealed to attendees after they RSVP or buy</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LocationForm
