'use client';

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function JoinGame() {
  const router = useRouter()
  const onJoin = () => {
    router.push('/game')
  }
  return (
    <div className="w-100% max-w-lg rounded-md border-2 border-[#28323C] p-6 flex flex-1 flex-col gap-y-4">
      <Button className="flex flex-1 bg-[#6031C3] text-white py-4 hover:text-black" onClick={onJoin}>
        Join game
      </Button>
      <div className="flex flex-1 flex-row justify-between items-center">
        <Item heading="Bet amount" description="$100" />
        <Seperator />
        <Item heading="Game mode" description="First to 2x" />
        <Seperator />
        <Item heading="Time limit" description="24 hours" />
      </div>
    </div>
  )
}

type ItemProps = {
  heading: string;
  description: string
}

function Item(props: ItemProps) {
  const { heading, description } = props;
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-500">{heading}</p>
      <p className="text-sm">{description}</p>
    </div>
  )
}

function Seperator() {
  return <div className="h-6 w-[1px] bg-[#28323C]" />
}