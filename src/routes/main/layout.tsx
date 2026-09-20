import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <><Navbar />
    <Outlet />
    <Footer/>
    </>
  )
}
