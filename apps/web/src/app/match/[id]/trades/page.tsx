import { TickersBar } from "@/components/atoms/TickersBar/TickersBar";
import { TradeBox } from "@/components/atoms/TradeBox/TradeBox";
import { BonkDemoChart } from "@/components/atoms/Charts/BonkDemoChart";
import { MatchResultDialog } from "@/components/atoms/MatchResultDialog/MatchResultDialog";
import { TradePositions } from "@/components/atoms/TradePositions/TradePositions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MatchTrade({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-2 gap-4 w-full">
      <TickersBar />
      <div className="flex w-full flex-row justify-between items-start gap-x-4">
        <div className="flex flex-col w-[70%] h-full">
          <div className="flex flex-col w-full min-h-[50vh] mb-8">
            <BonkDemoChart />
          </div>
          <div className="w-full">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="opponent">Opponent</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <TradePositions />
              </TabsContent>
              <TabsContent value="closed">
                <TradePositions />
              </TabsContent>
              <TabsContent value="opponent">
                {/* <TradePositions /> */}
              </TabsContent>
            </Tabs>
            <div className="h-48"/>
          </div>
        </div>
        <div className="flex flex-col flex-auto w-[30%]">
          <TradeBox />
          <MatchResultDialog />
        </div>
      </div>
    </div>
  );
}
