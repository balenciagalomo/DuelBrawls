import { InfoItem, InfoItemSeperator } from "./InfoItem";

type MatchInformationProps = {
  betAmount: number
  tradingAmount: number
}

export function MatchInformation(props: MatchInformationProps) {
  const { betAmount, tradingAmount } = props;
  return (
    <div className="flex flex-1 flex-row justify-between items-center">
      <InfoItem heading="Bet amount" description={`$${betAmount}`} />
      <InfoItemSeperator />
      <InfoItem heading="Trading" description={`$${tradingAmount}`} />
      <InfoItemSeperator />
      <InfoItem heading="Game mode" description="First to 2x" />
      <InfoItemSeperator />
      <InfoItem heading="Time limit" description="24 hours" />
    </div>
  )
}

export function MVPMatchInformation() {
  return <MatchInformation betAmount={100} tradingAmount={150} />
}