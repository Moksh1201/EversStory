import React from 'react';

interface AvatarImageProps {
  src: string;
  alt: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} className="aspect-square h-full w-full" />;
};
