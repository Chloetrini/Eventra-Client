import { useNavigate } from "react-router";
import { CloudUpload } from "lucide-react";
import { UI_ASSETS } from "@/lib/assets";
import PaymentBtn from "../ui/pay-method-btn";
import OnboardingDrawer from "./onboarding-drawer";

const OnboardingNavbar = () => {
  const navigate = useNavigate();
  const handleSaveAndExit = () => {
    navigate("/dashboard/overview");
  };

  return (
    <div>
      <div className="h-18 border-b-2 border-b-[#E8E6E0] px-5 md:px-10 lg:px-25 py-5 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={UI_ASSETS.Eventraa} alt="eventra-Logo" />
          <p className="font-extrabold text-[27px] dark:text-white font-grotesk tracking-tight">
            Eventra
          </p>
        </div>
        <div className="flex items-center gap-1">
          <PaymentBtn
            text={"Save & exit"}
            icon={CloudUpload}
            classname="gap-2 text-black border-0 dark:text-white dark:border"
            onClick={handleSaveAndExit}
          />
          <OnboardingDrawer />
        </div>
      </div>
    </div>
  );
};

export default OnboardingNavbar;
