import React from 'react';

interface AvatarFallbackProps {
  children: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-white">
      {children}
    </div>
  );
};
