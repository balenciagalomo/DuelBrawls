'use client';

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import ExampleAvatar2 from '@/app/assets/images/example-avatar-2.png'
import { useMatchContext } from '@/contexts/MatchProvider';

import { useQuery } from "@tanstack/react-query";
import { StaticImageData } from 'next/image';
import { trpc } from '@/app/trpc';
import { useMe } from '../auth/useMe';

type ChatMessageItem = {
  avatar: StaticImageData;
  from: string;
  time: string;
  message: string;
}

const QUERY_KEY = 'chat-messages';

export function useChatMessages() {
  const meQuery = useMe();
  const { matchId } = useMatchContext()
  return useQuery<ChatMessageItem[]>({
    queryKey: [QUERY_KEY, matchId],
    queryFn: () => {
      return trpc.message.read.query({
        matchId
      }).then(messages => messages.map(message => ({
        id: message.id,
        avatar: meQuery?.data?.id === message.user_id ? ExampleAvatar2 : ExampleAvatar,
        from: meQuery?.data?.id === message.user_id ? 'BURGERBOB' : 'Dumpling',
        time: '6 min ago',
        message: message.message
      })));
    },
    enabled: Boolean(meQuery.data?.id),
    refetchInterval: 1000
  })
}

useChatMessages.queryKey = QUERY_KEY