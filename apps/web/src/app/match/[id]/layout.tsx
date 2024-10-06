import { BottomNav } from "@/components/atoms/BottomNav/BottomNav";
import { ChatBox } from "@/components/atoms/ChatBox/ChatBox";
import { PropsWithChildren } from "react";

export default function MatchLayout(props: PropsWithChildren<{ params: { id: string } }>) {
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-2 gap-4 w-full">
      {props.children}
      <ChatBox />
      <BottomNav matchId={props.params.id} />
    </div>
  )
}