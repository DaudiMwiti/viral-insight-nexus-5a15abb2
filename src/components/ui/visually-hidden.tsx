
import { cn } from "@/lib/utils";
import React from "react";

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const VisuallyHidden = ({ 
  children, 
  className, 
  ...props 
}: VisuallyHiddenProps) => {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{ clip: "rect(0 0 0 0)" }}
      {...props}
    >
      {children}
    </span>
  );
};
