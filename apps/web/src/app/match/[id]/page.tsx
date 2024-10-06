import { TickersBar } from "@/components/atoms/TickersBar/TickersBar";
import { TradeBox } from "@/components/atoms/TradeBox/TradeBox";
import { ProfitAndLossChart } from "@/components/atoms/Charts/ProfitAndLossChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BonkDemoChart } from "@/components/atoms/Charts/BonkDemoChart";
import { MatchResultDialog } from "@/components/atoms/MatchResultDialog/MatchResultDialog";
import { TradePositions } from "@/components/atoms/TradePositions/TradePositions";
import { ChatBox } from "@/components/atoms/ChatBox/ChatBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default async function Match({ params }: { params: { id: string } }) {
  console.log('params', params)
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-2 gap-4 w-full">
      <TickersBar />
      <div className="flex w-full flex-row justify-between items-start gap-x-4 h-[calc(100vh-200px)]">
        <div className="flex flex-col w-[70%] h-full">
          <Card className="flex flex-col w-full min-h-[75%] mb-12">
            <CardContent className="flex-grow p-0">
              <div className="w-full h-full">
                <BonkDemoChart />
              </div>
            </CardContent>
          </Card>
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

          </div>
        </div>
        <div className="flex flex-col flex-auto w-[30%]">
          <TradeBox />
          <MatchResultDialog />
          <ChatBox />
        </div>
      </div>
    </div >
  );
}
