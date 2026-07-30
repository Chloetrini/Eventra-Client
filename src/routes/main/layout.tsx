
import Footer from '@/components/ui/footer'
import Navbar from '@/components/ui/navbar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <>
    <Navbar/>
      <Outlet />
      <Footer/>
      
      </>
  )
}
