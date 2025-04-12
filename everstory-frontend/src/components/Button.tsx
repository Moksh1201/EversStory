import { cn } from "./../utils/cn";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-semibold transition",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-black hover:bg-gray-300",
        className
      )}
      {...props}
    />
  );
};
