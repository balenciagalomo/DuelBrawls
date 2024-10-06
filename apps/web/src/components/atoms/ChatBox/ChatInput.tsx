'use client';

import ExampleAvatar2 from '@/app/assets/images/example-avatar-2.png'
import { useChatMessageSend } from '@/hooks/chat/useChatMessageSend';
import Image from 'next/image'
import { useState } from 'react';

export function ChatInput() {
  const sendMessage = useChatMessageSend();
  const [message, setMessage] = useState<string>('')
  return (
    <div className="p-4 border rounded-md w-full flex flex-row items-center w-full flex-shrink-1 gap-x-4">
      <Image src={ExampleAvatar2} alt='avatar' className='w-10 h-10' />
      <input
        className='bg-transparent outline-none text-xs flex-1'
        placeholder='Message...'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={() => {
          console.log('on submit')
        }}
        onKeyUp={({ key }) => {
          if (key === 'Enter') {
            sendMessage.mutateAsync(message).then(() => setMessage(''))
          }
        }} />
    </div>
  )
}