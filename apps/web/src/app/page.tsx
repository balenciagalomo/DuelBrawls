import { JoinGame } from "@/components/atoms/JoinGame/JoinGame";
import { MatchMakingProvider } from "@/components/atoms/JoinGame/MatchMakingProvider";

export default async function Home() {
  return (
    <div
      className="flex flex-1 flex-row justify-center items-center">
      <MatchMakingProvider>
        <JoinGame />
      </MatchMakingProvider>
    </div>
  );
}
