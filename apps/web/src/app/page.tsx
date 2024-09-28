import { JoinGame } from "@/components/atoms/JoinGame/JoinGame";

export default async function Home() {
  return (
    <div
      className="flex flex-1 flex-row justify-center items-center">
      <JoinGame />
    </div>
  );
}
