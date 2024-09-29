
'use client';

import React, { useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';

type MatchOpponentProps = {
  image?: StaticImageData;
  label?: string;
}

export function MatchOpponent(props: MatchOpponentProps) {
  const { image, label } = props;
  const avatar = useMemo(() => {
    const commonStyleClasses = 'w-16 h-16 bg-gray-800 rounded-full'
    if (image) {
      return <Image src={image} alt='avatar' className={commonStyleClasses} />
    }
    return <div className={commonStyleClasses} />
  }, [image])

  return (
    <div className='flex flex-col gap-y-4 items-center'>
      {avatar}
      {label && <p className='text-sm'>{label}</p>}
    </div>
  )
}