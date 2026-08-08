import CreateEventSidebar from '@/components/dashboard-create-event/create-event-sidebar'
import { Outlet } from 'react-router'

const CreateEventLayout = () => {
  return (
    <div>
      <div className='flex pt-10'>
        <CreateEventSidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default CreateEventLayout
