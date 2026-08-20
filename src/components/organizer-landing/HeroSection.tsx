import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { HERO_DATA, AVATAR_IMAGES } from "@/lib/organizer-constants"; // import avatar images
import { Star } from "lucide-react";
import image from '@/assets/image-12.png'
// import { Dot } from "lucide-react";

const HeroSec: React.FC = () => {


  // Use fallback data if API fails or data is not available
  const hero =  HERO_DATA;
  // Use avatar images from constants (or from data if available)
  const avatars = AVATAR_IMAGES;


  

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 md:px-8">
      <div className="Text-center flex flex-col items-center gap-6 py-12 md:py-16">

        {/* "FOR ORGANIZERS" badge */}
        <div className="flex items-center gap-2">
          <span className="bg-[#F5A524] h-[1px] w-[20px] rounded-full"></span>
          <p className="text-[#F5A524] font-medium text-sm md:text-base tracking-widest uppercase">
            FOR ORGANIZERS
          </p>
        </div>

        {/* Main heading */}
        <h1 className="font-extrabold  text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight tracking-tight max-w-4xl">
          Sell tickets. <span className="text-[#0F6E56] dark:text-[#4ADE80]">Get paid.</span> No stress.
        </h1>

        {/* Subtitle */}
        <p className="font-bold text-center text-base sm:text-lg md:text-[18px] text-muted-foreground max-w-2xl mx-auto md:w-129">
          Publish a polished event in minutes, sell with real payments, check guests in at the gate and get settled a few days later – all from one dashboard.
        </p>

        {/* CTA Buttons — on mobile these stack (flex-col), and the two
            buttons had different horizontal padding (px-10 vs px-16) plus
            different label lengths, so their edges didn't line up. Both
            now go full-width on mobile (w-full) so they align, and revert
            to their own natural width side-by-side from sm: up. */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 w-full sm:w-auto px-4 sm:px-0">
          <Link to={"/auth/organizer/register"} className="w-full sm:w-auto">
            <Button variant="default" size="lg" className="w-full sm:w-auto bg-[#0F6E56] px-10 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              Start selling – it's free →
            </Button>
          </Link>
          <Link to="/features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-16 py-6 text-base font-semibold rounded-xl border-2 hover:bg-accent/50 transition-colors">
              Talk to us
            </Button>
          </Link>
        </div>

        {/* Avatars + Trust badge */}
        <div className="flex flex-col sm:flex-row items-center gap-1 mt-8">
          {/* Avatar stack */}
          <div className="flex -space-x-3">
            {avatars.map((avatar: { id: string; image: string }) => (
              <img
                key={avatar.id}
                src={avatar.image}
                alt="Organizer avatar"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background shadow-md object-cover"
                loading="lazy"
              />
            ))}
          </div>

          {/* Stars + text */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex text-[#F5A524]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm md:text-base font-medium whitespace-nowrap">
              Trusted by 1,000+ organizers
            </p>
          </div>
        </div>

      </div>
      <div >
          <img className="w-full" src={image} alt="" />
      </div>
    </section>
 );
};


export default HeroSec;
