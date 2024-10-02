'use client';

import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar"

const data = [
  { time: 0, DUMPLING: 1, BURGERBOB: 1 },
  { time: 4, DUMPLING: 1.2, BURGERBOB: 1.3 },
  { time: 8, DUMPLING: 1.4, BURGERBOB: 1.5 },
  { time: 12, DUMPLING: 1.3, BURGERBOB: 1.7 },
  { time: 16, DUMPLING: 1.5, BURGERBOB: 1.4 },
  { time: 20, DUMPLING: 1.4, BURGERBOB: 1.2 },
  { time: 24, DUMPLING: 1.6, BURGERBOB: 1.1 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-2 text-xs">
          <p className="text-white">1 BURGERBOB = {data.BURGERBOB.toFixed(3)} DUMPLING</p>
          <p className="text-green-400">PNL: +13%</p>
        </CardContent>
      </Card>
    )
  }
  return null
}

export function PnLDemoChart() {
  return (
    <div className="w-full h-full bg-gray-950 p-8 flex flex-col">
      <div className="mb-4 flex space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-cyan-400 mr-2"></div>
          <span className="text-cyan-400">DUMPLING</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2"></div>
          <span className="text-green-400">BURGERBOB</span>
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              stroke="#4B5563"
              tickFormatter={(value) => value === 0 ? 'START' : value === 24 ? 'END' : `${value} HOURS`}
            />
            <YAxis 
              stroke="#4B5563" 
              domain={[1, 2]} 
              ticks={[1, 1.5, 2]} 
              tickFormatter={(value) => `${value}x`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="DUMPLING" stroke="#22D3EE" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="BURGERBOB" stroke="#4ADE80" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="DUMPLING" />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="BURGERBOB" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}