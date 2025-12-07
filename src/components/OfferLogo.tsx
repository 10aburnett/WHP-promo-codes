'use client';

import { useState } from 'react';
import Image from 'next/image';
import { normalizeImagePath } from '@/lib/image-utils';
import InitialsAvatar from '@/components/InitialsAvatar';

interface DealLogo {
  id: string;
  name: string;
  logo: string | null;
}

interface OfferLogoProps {
  offer: DealLogo;
}

export default function OfferLogo({ offer }: OfferLogoProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = normalizeImagePath(offer.logo || '');

  return (
    <>
      {!imageError ? (
        <Image
          src={imagePath}
          alt={`${offer.name} logo`}
          width={80}
          height={80}
          className="w-full h-full object-contain"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          priority
          unoptimized={imagePath.includes('@avif')}
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 64px, 80px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyytN5cFrKDsRXSJfAhvT7WinYGCvchOjJAMfNIXGiULZQ8qEzJQdEKKRjFiYqKJKEJxZJXiEH0RRN6mJzN5hJ8tP/Z"
        />
      ) : (
        <InitialsAvatar
          name={offer.name} 
          size="xl" 
          shape="square"
          className="w-full h-full"
        />
      )}
    </>
  );
} 