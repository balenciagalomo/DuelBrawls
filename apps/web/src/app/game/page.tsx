import { TickersBar } from "@/components/atoms/TickersBar/TickersBar";
import { TradeBox } from "@/components/atoms/TradeBox/TradeBox";

export default async function Game() {
  return (
    <div
      className="flex flex-1 flex-col justify-start items-start mt-2 gap-4">
      <TickersBar />
      <div
        className="flex w-full flex-row justify-between items-start gap-x-4">

        <div className="flex flex-auto h-56 w-[70%]" />
        <div className="flex flex-auto w-[30%]" >
          <TradeBox/>
        </div>
      </div>
    </div>
  );
}
