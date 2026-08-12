import { Outlet } from "react-router"

const Dashboardlayout = () => {
  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='bg-[#00bd65] w-[295px] h-screen'>
      </div>
      <div className="w-full flex flex-col gap-2 min-h-0">

        <div className='w-full h-[96px] bg-[#E4F1EB] shrink-0'></div>
        {/* <div className='w-[95%] h-[91px] self-center rounded-xl bg-[#E4F1EB] shrink-0'></div> */}

        <div className='flex-1 min-h-0'>
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default Dashboardlayout