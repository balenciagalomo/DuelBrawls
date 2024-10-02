import { Button } from "@/components/ui/button";
import { useMatchMakingContext } from "./MatchMakingProvider";
import { InfoItem, InfoItemSeperator } from "./InfoItem";
import { MVPMatchInformation } from "./MatchInformation";

export function JoinGameIdle() {
  const { onJoin } = useMatchMakingContext()
  return (
    <div className="w-100% max-w-lg rounded-md border-2 border-[#28323C] p-6 flex flex-1 flex-col gap-y-4">
      <Button className="flex flex-1 bg-[#6031C3] text-white py-4 hover:text-black" onClick={onJoin}>
        Join game
      </Button>
      <MVPMatchInformation/>
    </div>
  )
}