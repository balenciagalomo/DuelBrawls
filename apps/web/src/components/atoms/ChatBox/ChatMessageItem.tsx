import Image, { StaticImageData } from 'next/image'

type ChatMessageItemProps = {
  avatar: StaticImageData;
  from: string;
  time: string;
  message: string;
}

export function ChatMessageItem(props: ChatMessageItemProps) {
  return (
    <div className="w-full flex flex-row gap-y-4 gap-x-4 p-4 bg-[#0B1013] rounded-md">
      <Image src={props.avatar} alt='avatar' className='w-10 h-10' />
      <div className='w-full flex flex-col gap-y-2'>
        <div className='w-full flex flex-row justify-between'>
          <p className='text-trade-up text-xs'>
            {props.from}
          </p>
          <p className='text-white text-xs'>
            {props.time}
          </p>
        </div>
        <p className='text-white text-xs'>
          {props.message}
        </p>
      </div>
    </div>
  )
}