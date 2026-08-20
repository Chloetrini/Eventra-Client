import React from "react";
import { SECTION_FOUR_DATA } from "@/lib/organizer-constants";
import { CtaBanner } from "../ui/ctaBanner";
import { UI_ASSETS } from "@/lib/assets";

const SectionFour: React.FC = () => {
  const data = SECTION_FOUR_DATA;

  return (
    <div>
      <CtaBanner
        label="TAKES ABOUT 5 MINUTES"
        heading="Your event, live today."
        body="Set up your organizer account, add your tickets and share one link. We'll handle the payments, the gate and the payout."
        primaryBtn={{
          text: "Become an organizer",
          to: "/auth/organizer/register",
        }}
        secondaryBtn={{ text: "Contact sale", to: "/contact" }}
        bgImage={UI_ASSETS.manWithHandUp}
        align="left"
      />
    </div>
  );
};

export default SectionFour;