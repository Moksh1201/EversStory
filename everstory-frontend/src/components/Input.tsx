import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
