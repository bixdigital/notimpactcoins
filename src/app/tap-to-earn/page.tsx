'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Coins, ArrowLeft } from 'lucide-react'
import { useStats } from '@/context/StatsProvider'

export default function TapToEarn() {
  const [energy, setEnergy] = useState(10)
  const [lastTapTime, setLastTapTime] = useState(Date.now())
  const { stats, incrementTaps, incrementCoins } = useStats()

  useEffect(() => {
    const savedEnergy = localStorage.getItem('tapEnergy')
    const savedLastTapTime = localStorage.getItem('lastTapTime')
    if (savedEnergy) setEnergy(Number(savedEnergy))
    if (savedLastTapTime) setLastTapTime(Number(savedLastTapTime))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const timePassed = now - lastTapTime
      const energyToRegenerate = Math.floor(timePassed / 60000) // 1 energy per minute
      if (energyToRegenerate > 0) {
        setEnergy(prev => Math.min(prev + energyToRegenerate, 10))
        setLastTapTime(now)
        localStorage.setItem('tapEnergy', energy.toString())
        localStorage.setItem('lastTapTime', now.toString())
      }
    }, 60000) // Check every minute

    return () => clearInterval(timer)
  }, [energy, lastTapTime])

  const handleTap = () => {
    if (energy > 0) {
      incrementTaps()
      incrementCoins(stats.multiplier)
      setEnergy(prev => {
        const newEnergy = prev - 1
        localStorage.setItem('tapEnergy', newEnergy.toString())
        return newEnergy
      })
      setLastTapTime(Date.now())
      localStorage.setItem('lastTapTime', Date.now().toString())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-purple-900 p-6">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      <h1 className="text-white text-3xl font-bold mb-6">Tap to Earn</h1>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-white text-2xl">Balance: {stats.totalCoins.toLocaleString()} Coins</div>
        <div className="text-white text-xl">Energy: {energy}/10</div>
        <Button
          onClick={handleTap}
          disabled={energy === 0}
          className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-3xl rounded-full"
        >
          <Coins className="w-16 h-16" />
        </Button>
        <p className="text-white">Tap Reward: {stats.multiplier} coins</p>
        <p className="text-white text-sm">Energy regenerates over time</p>
      </div>
    </div>
  )
}