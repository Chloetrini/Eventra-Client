import { Outlet } from "react-router"

const Dashboardlayout = () => {
  return (
    <div className='flex'>
      <div className='bg-[#E4F1EB] w-[295px] h-screen'>
      </div>
      <div className="w-full flex flex-col gap-2">

        <div className='w-full h-[96px] bg-[#E4F1EB]'></div>
        <div className='w-[95%] h-[91px] self-center rounded-xl bg-[#E4F1EB]'></div>

        <Outlet />
      </div>

    </div>
  )
}

export default Dashboardlayout