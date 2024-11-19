'use client'

import { useStats } from '@/context/StatsProvider'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BarChart2, Coins, Flame, Trophy } from 'lucide-react'

export default function Stats() {
  const { stats } = useStats()
  console.log(stats);
  // const { totalCoins, totalBoosts, totalTaps, currentLevel } = stats
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-purple-900">
      <header className="flex justify-between items-center p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white">
            ← Back
          </Button>
        </Link>
        <span className="text-white font-bold">Stats</span>
        <div className="w-10" />
      </header>

      <main className="flex flex-col items-center p-4">
        <h1 className="text-3xl text-white font-bold mb-8">Statistics</h1>

        <div className="w-full max-w-md bg-secondary p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex items-center">
            <Coins className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-xl text-white">Total Coins: {stats.totalCoins.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Flame className="w-6 h-6 text-red-400 mr-2" />
            <span className="text-xl text-white">Total Boosts: {stats.totalBoosts}</span>
          </div>
          <div className="flex items-center">
            <BarChart2 className="w-6 h-6 text-green-400 mr-2" />
            <span className="text-xl text-white">Total Taps: {stats.totalTaps.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-yellow-700 mr-2" />
            <span className="text-xl text-white">Current Level: {stats.currentLevel}</span>
          </div>
        </div>

        <Link href="/">
          <Button variant="ghost" className="mt-8 text-white">
            ← Back to Home
          </Button>
        </Link>
      </main>
    </div>
  )
}
