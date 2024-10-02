import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PnLDemoChart } from "@/components/atoms/Charts/PnLDemoChart";

export default function PnLDemoPage() {
  return (
    <div className="flex flex-1 flex-col justify-start items-start mt-2 gap-4 w-full">
      <Card className="flex flex-col w-full h-[calc(100vh-100px)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-center">PNL DEMO CHART</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <div className="w-full h-full">
            <PnLDemoChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}