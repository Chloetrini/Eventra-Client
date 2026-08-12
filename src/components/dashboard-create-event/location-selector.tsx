import online from '@/assets/online.png'
import { User } from 'lucide-react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { cn } from '@/lib/utils'

type LocationSelectorProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
}

function LocationSelector<T extends FieldValues>({ name, control }: LocationSelectorProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex">
          <button
            type="button"
            onClick={() => field.onChange('physical')}
            className={cn(
              'flex items-center py-[5px] px-[10px] rounded-l-[10px] h-[50px] w-[168px] gap-2',
              field.value === 'physical' ? 'bg-[#1A1523]' : 'border'
            )}
          >
            <div className=''>
              <User className={cn('w-6 h-6', field.value === 'physical' ? 'text-white' : 'text-black')} />
            </div>
            <p className={field.value === 'physical' ? 'text-white' : ''}>Physical Venue</p>
          </button>
          <button
            type="button"
            onClick={() => field.onChange('online')}
            className={cn(
              'flex items-center py-[5px] px-[10px] rounded-r-[10px] h-[50px] w-[109px] gap-2',
              field.value === 'online' ? 'bg-[#1A1523]' : 'border'
            )}
          >
            <div className={field.value === 'online' ? '' : 'text-black'}>
              <img src={online} alt="" className='w-7 h-6' />
            </div>
            <p className={field.value === 'online' ? 'text-white' : ''}>Online</p>
          </button>
        </div>
      )}
    />
  )
}

export default LocationSelector