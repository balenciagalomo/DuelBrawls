import { TickersBar } from "@/components/atoms/TickersBar/TickersBar";

export default async function Game() {
  return (
    <div
      className="flex flex-1 flex-row justify-start items-start mt-2">
      <TickersBar />
    </div>
  );
}
