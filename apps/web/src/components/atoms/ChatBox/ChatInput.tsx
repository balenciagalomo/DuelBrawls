import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import Image from 'next/image'

export function ChatInput() {
  return (
    <div className="p-4 border rounded-md w-full flex flex-row items-center w-full flex-shrink-1 gap-x-4">
      <Image src={ExampleAvatar} alt='avatar' className='w-10 h-10' />
      <input
        className='bg-transparent outline-none text-xs flex-1'
        placeholder='Message...'/>
    </div>
  )
}