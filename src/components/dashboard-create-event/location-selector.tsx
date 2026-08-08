import online from '@/assets/online.png'
import { User } from 'lucide-react'


const LocationSelector = () => {
  return (
    <div className="flex">
        <button className='flex bg-[#1A1523] items-center py-[5px] px-[10px] rounded-l-[10px] h-[50px] w-[168px] gap-2'>
            <div className=''>
                <User className='w-6 h-6 text-white'/>
            </div>
            <p className='text-white'>Physical Venue</p>
        </button>
        <button className='flex items-center py-[5px] px-[10px] rounded-r-[10px] h-[50px] w-[109px] gap-2 border'>
            <div className='text-black'>
                <img src={online} alt="" className='w-7 h-6'/>
            </div>
            <p className=''>Online</p>
        </button>
    </div>
  )
}

export default LocationSelector