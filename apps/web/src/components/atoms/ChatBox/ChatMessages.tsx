'use client';

import { useChatMessages } from '@/hooks/chat/useChatMessages'
import { ChatMessageItem } from './ChatMessageItem'

export function ChatMessages() {
  const messagesQuery = useChatMessages()
  return (
    <div className="w-full flex flex-1 flex-col gap-y-4 overflow-y-scroll">
      {messagesQuery.data?.map((item, index) => (
        <ChatMessageItem
          key={index.toString()}
          avatar={item.avatar}
          from={item.from}
          message={item.message}
          time={item.time} />
      ))}
    </div>
  )
}