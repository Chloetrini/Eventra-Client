import React from "react";
import { Link } from "react-router";

interface CtaBannerProps {
  label: string;
  heading: string;
  body: string;
  primaryBtn: {
    text: string;
    to?: string;
    onClick?: () => void;
  };
  secondaryBtn: {
    text: string;
    to?: string;
    onClick?: () => void;
  };
  bgImage?: string;
  align?: "center" | "left";
  className?: string;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  label,
  heading,
  body,
  primaryBtn,
  secondaryBtn,
  bgImage,
  align = "center",
  className = "",
}) => {
  const isLeft = align === "left";

  return (
    <section
      className={`bg-[#0D0D1A] rounded-3xl overflow-hidden relative text-white shadow-2xl ${className}`}
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
      {/* Dark overlay — gradient transitions smoothly on small screens */}
      {bgImage && (
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#0D0D1A] via-[#0D0D1A]/90 to-transparent z-0" />
      )}

      <div
        className={`relative z-10 px-6 sm:px-14 py-10 sm:py-14 space-y-4 sm:space-y-5
          ${isLeft ? "max-w-xl text-left" : "max-w-xl mx-auto text-center"}
        `}
      >
        {/* Label */}
        <span
          className={`text-xs font-normal uppercase text-[#F5A524] tracking-widest font-geist flex items-center gap-1
            ${isLeft ? "justify-start" : "justify-center"}
          `}
        >
          {label}
        </span>

        {/* Heading */}
        <h2
          className={`text-2xl sm:text-4xl lg:text-[54px] font-[700] font-grotesk md:max-w-[602px] leading-tight
            ${isLeft ? "text-left" : "text-center"}
          `}
        >
          {heading}
        </h2>

        {/* Body */}
        <p
          className={`text-white/70 text-sm sm:text-[15px] font-normal leading-6 font-geist
            ${isLeft ? "text-left" : "text-center"}
          `}
        >
          {body}
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 pt-2
            ${isLeft ? "items-stretch sm:items-start" : "items-stretch sm:items-center justify-center"}
          `}
        >
          {primaryBtn.to ? (
            <Link
              to={primaryBtn.to}
              className="w-full sm:w-auto text-center px-8 py-3.5 md:bg-[#0F6E56] hover:bg-[#0A4F41] md:hover:bg-[#0A4F41] text-[#4A4451] md:text-white font-semibold md:font-bold text-sm rounded-xl transition-all shadow-lg font-geist bg-[#F5A524]"
            >
              {primaryBtn.text}
            </Link>
          ) : (
            <button
              onClick={primaryBtn.onClick}
              className="w-full sm:w-auto text-center px-8 py-3.5 md:bg-[#0F6E56] hover:bg-[#0A4F41] md:hover:bg-[#0A4F41] text-[#4A4451] md:text-white font-semibold md:font-bold text-sm rounded-xl transition-all shadow-lg font-geist bg-[#F5A524]"
            >
              {primaryBtn.text}
            </button>
          )}

          {secondaryBtn.to ? (
            <Link
              to={secondaryBtn.to}
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-white md:bg-transparent hover:bg-[#1A1523] hover:text-white text-[#1A1523] md:text-white font-semibold text-sm rounded-xl md:border md:border-white/30 transition-colors font-geist"
            >
              {secondaryBtn.text}
            </Link>
          ) : (
            <button
              onClick={secondaryBtn.onClick}
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-white md:bg-transparent hover:bg-[#1A1523] hover:text-white text-[#1A1523] md:text-white font-semibold text-sm rounded-xl md:border md:border-white/30 transition-colors font-geist"
            >
              {secondaryBtn.text}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};