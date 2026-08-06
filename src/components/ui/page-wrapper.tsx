import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  return (
    <div className={cn("pt-20 pb-16 px-4 sm:px-8 lg:px-[100px] max-w-[1440px] mx-auto min-h-screen", className)}>
      {children}
    </div>
  );
};

export default PageWrapper;
