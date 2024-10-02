'use client';

type InfoItemProps = {
  heading: string;
  description: string
}

export function InfoItem(props: InfoItemProps) {
  const { heading, description } = props;
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-500">{heading}</p>
      <p className="text-sm">{description}</p>
    </div>
  )
}

export function InfoItemSeperator() {
  return <div className="h-6 w-[1px] bg-[#28323C]" />
}
