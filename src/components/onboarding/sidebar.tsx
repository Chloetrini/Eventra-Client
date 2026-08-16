import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import onboardingSidebarImage from '@/assets/onboarding sidebar image.png'
import sidebarBankImg from '@/assets/sidebarBankImg.png'
import onboardingReviewimg from '@/assets/onboardingReviewimg.png'
import { useStepGuard } from '@/services/use-step-guard'

export const stepsFlow = [
  {
    step: "Organization",
    description: "Who are you?",
    path: "/onboarding/organisation"
  },
  {
    step: "Bank account",
    description: "Get paid",
    path: "/onboarding/bank-account"
  },
  {
    step: "Review",
    description: "Submit for approval",
    path: "/onboarding/review"
  },
]

const OnboardingSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { canJumpTo } = useStepGuard()

  const handleClick = async (path: string) => {
    const targetIndex = stepsFlow.findIndex((s) => s.path === path)
    const allowed = await canJumpTo(targetIndex)
    if (allowed) navigate(path)
  }

  return (
    location.pathname !== "/onboarding/success" && (
    <div className="hidden lg:block">
      <div className="w-98.75 h-[calc(100vh-72px)] border-r-2 border-border pt-15 flex flex-col items-center justify-between">
        <div className="flex flex-col gap-10">
          {stepsFlow.map((flow, id) => (
            <div key={flow.path}>
              <button
                className={`flex flex-col items-start justify-center text-start w-[254px] h-[87px] rounded-[10px] p-5 ${flow.path === location.pathname ? 'bg-[#E4F1EB] dark:bg-[#0F6E56]/15' : ''
                  }`}
                onClick={() => handleClick(flow.path)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${flow.path === location.pathname
                        ? 'text-white bg-[#0F6E56]'
                        : 'bg-white dark:bg-card border-2'
                      }`}
                  >
                    <p className="font-semibold">{id + 1}</p>
                  </div>

                  <div>
                    <p className="font-medium">{flow.step}</p>
                    <p className="text-sm text-muted-foreground">
                      {flow.description}
                    </p>
                  </div>
                </div>
              </button>

              {id + 1 !== stepsFlow.length && (
                <div className="h-full border-l-2 ml-10" />
              )}
            </div>
          ))}
        </div>

        <div>
          <img
            src={
              location.pathname === "/onboarding/organisation" ?
              onboardingSidebarImage : location.pathname === "/onboarding/bank-account" ? sidebarBankImg : onboardingReviewimg
            }
            alt=""
            className="max-w-[324px] max-h-[250px]"
          />
        </div>
      </div>
    </div>
    )
  )
}

export default OnboardingSidebar