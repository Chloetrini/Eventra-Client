import { useNavigate } from "react-router"
import { CloudUpload } from "lucide-react"
import eventraLogo from "@/assets/Eventra-logo.png"
import PaymentBtn from "../ui/pay-method-btn"
import OnboardingDrawer from "./onboarding-drawer"

const OnboardingNavbar = () => {
  const navigate = useNavigate()
  
  // values are already mirrored to sessionStorage by the layout on every
  // change, so "saving" here is really just leaving — the draft is picked
  // back up automatically when they return to /onboarding
  const handleSaveAndExit = () => {
    navigate("/organizer/dashboard")
  }

  return (
    <div>
      <div className='h-18 border-b-2 border-b-[#E8E6E0] px-5 md:px-10 lg:px-25 py-5 flex justify-between items-center'>
        <div className="flex items-center gap-2">
          <OnboardingDrawer />
          <img src={eventraLogo} alt="" className="w-6 h-8"/>
          <p className="font-extrabold text-[27px]">Eventra</p>
        </div>
        <div>
          <PaymentBtn
          text={"Save & exit"}
          icon={CloudUpload}
          classname="gap-2 text-black border-0"
          onClick={handleSaveAndExit}
          />
        </div>
      </div>
    </div>
  )
}

export default OnboardingNavbar