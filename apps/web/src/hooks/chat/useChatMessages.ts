'use client';

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import ExampleAvatar2 from '@/app/assets/images/example-avatar-2.png'

import { useQuery } from "@tanstack/react-query";
import { StaticImageData } from 'next/image';

type ChatMessageItem = {
  avatar: StaticImageData;
  from: string;
  time: string;
  message: string;
}

const QUERY_KEY = 'chat-messages';

export function useChatMessages() {
  return useQuery<ChatMessageItem[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => {
      return [
        {
          avatar: ExampleAvatar,
          from: 'BURGERBOB',
          time: '6 min ago',
          message: 'Ait broski, lets see who’s the better tradooor'
        },
        {
          avatar: ExampleAvatar2,
          from: 'Dumpling',
          time: '5 min ago',
          message: 'LETS GOOOO'
        },
        {
          avatar: ExampleAvatar,
          from: 'BURGERBOB',
          time: '1 min ago',
          message: 'Imma make 2X on bonk in like 3 minutes bro you have no idea'
        },
        {
          avatar: ExampleAvatar2,
          from: 'Dumpling',
          time: 'Just now',
          message: 'Lmao big talk for a burger'
        },
        {
          avatar: ExampleAvatar,
          from: 'BURGERBOB',
          time: 'Just now',
          message: 'Imma cook'
        },
      ]
    }
  })
}