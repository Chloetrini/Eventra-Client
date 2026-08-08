import React from "react";
import { Link } from "react-router";

interface CtaBannerProps {
  label: string;
  heading: string;
  body: string;
  primaryBtn: {
    text: string;
    to: string;
    onClick?: () => void;
  };
  secondaryBtn: {
    text: string;
    to: string;
    onClick?: () => void;
  };
  bgImage?: string;
  align?: "center" | "left";
   className?: string
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  label,
  heading,
  body,
  primaryBtn,
  secondaryBtn,
  bgImage,
  align = "center",
  
}) => {
  const isLeft = align === "left";

  return (
    <section
      className="bg-[#0D0D1A] rounded-3xl overflow-hidden relative text-white shadow-2xl"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }
          : undefined
      }
    >
      {/* Dark overlay — only when bg image is present */}
      {bgImage && (
        <div className="absolute inset-0 bg-linear-to-r from-[#0D0D1A] via-[#0D0D1A]/90 to-transparent z-0" />
      )}

      <div
        className={`relative z-10 px-8 sm:px-14 py-10 sm:py-14 space-y-5
          ${isLeft ? "max-w-xl text-center" : "max-w-xl mx-auto text-center"}
        `}
      >
        {/* Label */}
        <span
          className={`text-xs font-normal uppercase text-[#F5A524] tracking-widest font-geist flex items-center gap-1
            ${isLeft ? "justify-center sm:justify-start" : "justify-center"}
          `}
        >
         
          {label}
        </span>

        {/* Heading */}
        <h2 className="text-[54px] sm:text-4xl font-[700] font-grotesk md:max-w-[602px] text-start">
          {heading}
        </h2>

        {/* Body */}
        <p className="text-white/70 text-[15px] font-normal leading-6 font-geist text-start">
          {body}
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 pt-2
            ${isLeft ? "items-center sm:items-start" : "items-center justify-center"}
          `}
        >
          {primaryBtn.to ? (
            <Link
              to={primaryBtn.to}
              className="w-full sm:w-auto px-8 py-3.5 md:bg-[#0F6E56] hover:bg-[#0A4F41] hover:bg-[#F5A524]/90 md:hover:bg-[#0A4F41] text-[#4A4451] md:text-white font-semibold md:font-bold text-sm rounded-xl transition-all shadow-lg font-geist bg-[#F5A524]"
            >
              {primaryBtn.text}
            </Link>
          ) : (
            <button
              onClick={primaryBtn.onClick}
              className="w-full sm:w-auto px-8 py-3.5 md:bg-[#0F6E56] hover:bg-[#0A4F41] hover:bg-[#F5A524]/90 md:hover:bg-[#0A4F41] text-[#4A4451] md:text-white font-semibold md:font-bold text-sm rounded-xl transition-all shadow-lg font-geist bg-[#F5A524]"
            >
              {primaryBtn.text}
            </button>
          )}
          {secondaryBtn.to ? (
            <Link
              to={secondaryBtn.to}
              className="w-full sm:w-auto px-8 py-3.5 bg-white md:bg-none hover:bg-[#1A1523] hover:text-white text-[#1A1523] md:text-[#1A1523] font-semibold text-sm rounded-xl md:border md:border-white/30 transition-colors font-geist"
            >
              {secondaryBtn.text}
            </Link>
          ) : (
            <button
              onClick={secondaryBtn.onClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-white md:bg-none hover:bg-[#1A1523] hover:text-white text-[#1A1523] md:text-[#1A1523] font-semibold text-sm rounded-xl md:border md:border-white/30 transition-colors font-geist"
            >
              {secondaryBtn.text}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
