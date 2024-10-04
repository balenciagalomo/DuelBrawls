
'use client';

import React, { useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import Winner from '@/app/assets/svgs/winner.svg'

type MatchResultOpponentProps = {
  winner?: boolean;
  image?: StaticImageData;
  label?: string;
}

export function MatchResultOpponent(props: MatchResultOpponentProps) {
  const { winner, image, label } = props;

  const borderColorClass = useMemo(() => {
    if (winner) {
      return 'border-trade-up'
    }
    return 'border-trade-down'
  }, [winner])
  const avatar = useMemo(() => {
    const commonStyleClasses = 'w-24 h-24 bg-gray-800 rounded-full'
    if (image) {
      return <Image src={image} alt='avatar' className={commonStyleClasses} />
    }
    return <div className={commonStyleClasses} />
  }, [image])

  return (
    <div className='flex flex-col items-center gap-y-4'>
      <Image src={Winner} alt='winner' className={winner ? '' : 'invisible'} />
      <div className={`border-2 ${borderColorClass} rounded-full p-2`}>
        {avatar}
      </div>
    </div>
  )
}