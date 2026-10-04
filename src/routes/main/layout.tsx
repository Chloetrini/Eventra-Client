import { AppShell } from '@/components/app/app-shell'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import { useAppMode } from '@/hooks/shared/use-app-mode'
import { Outlet } from 'react-router'

export default function MainLayout() {
  // Installed on a phone: show the app experience instead of the website chrome.
  const appMode = useAppMode()
  if (appMode) return <AppShell />

  return (
    <><Navbar />
    <Outlet />
    <Footer/>
    </>
  )
}
