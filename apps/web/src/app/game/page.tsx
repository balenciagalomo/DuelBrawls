import { TickersBar } from "@/components/atoms/TickersBar/TickersBar";
import { TradeBox } from "@/components/atoms/TradeBox/TradeBox";
import { ProfitAndLossChart } from "@/components/atoms/Charts/ProfitAndLossChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Game() {
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-2 gap-4 w-full">
      <TickersBar />
      <div className="flex w-full flex-row justify-between items-start gap-x-4 h-[calc(100vh-200px)]">
        <Card className="flex flex-col w-[70%] h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Profit and Loss</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <div className="w-full h-full">
              <ProfitAndLossChart />
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-auto w-[30%]" >
          <TradeBox />
        </div>
      </div>
    </div>
  );
}
