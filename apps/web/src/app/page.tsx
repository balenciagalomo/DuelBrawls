import { Button } from "@/components/ui/button";
import { trpc } from "../app/trpc";
import { JoinGame } from "@/components/atoms/JoinGame/JoinGame";

export default async function Home() {
  const { greeting } = await trpc.hello.query({ name: `Tom` });
  return (
    <div
      className="flex flex-1 flex-row justify-center items-center">
      <JoinGame />
    </div>
  );
}
