'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useStats } from '@/context/StatsProvider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SlotMachine() {
  const symbols = ['🍒', '🍋', '🍉', '⭐', '💎']
  const [slots, setSlots] = useState(['', '', ''])
  const [bet, setBet] = useState<number>(0)
  const [gameHistory, setGameHistory] = useState<Array<{ result: string; amount: number }>>([])
  const { stats, incrementCoins, playGame, checkGameCooldown, setGameCooldown, completeTask } = useStats()
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [consecutivePlays, setConsecutivePlays] = useState(0)

  useEffect(() => {
    const savedHistory = localStorage.getItem('slotMachineHistory')
    const savedConsecutivePlays = localStorage.getItem('slotMachineConsecutivePlays')
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory))
    }
    if (savedConsecutivePlays) {
      setConsecutivePlays(Number(savedConsecutivePlays))
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (checkGameCooldown('slotMachine')) {
        setCooldownRemaining(0)
      } else {
        const lastPlayed = stats.gameCooldowns.slotMachine
        const remaining = Math.max(0, 3600000 - (Date.now() - lastPlayed))
        setCooldownRemaining(Math.ceil(remaining / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [stats.gameCooldowns.slotMachine, checkGameCooldown])

  const saveHistory = (newHistory: Array<{ result: string; amount: number }>) => {
    setGameHistory(newHistory)
    localStorage.setItem('slotMachineHistory', JSON.stringify(newHistory))
  }

  const spin = () => {
    if (!checkGameCooldown('slotMachine')) {
      alert("You need to wait before playing again!")
      return
    }

    if (bet > stats.totalCoins || bet <= 0) {
      alert("Invalid bet!")
      return
    }

    const newSlots = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ]
    setSlots(newSlots)

    let winAmount = 0
    let resultMessage = ''

    if (new Set(newSlots).size === 1) {
      const bonus = Math.min(consecutivePlays, 5) * 0.5 // Up to 250% bonus for consecutive plays
      winAmount = Math.floor(bet * (10 + bonus)) // Jackpot: all slots match
      resultMessage = `Jackpot! All symbols match! Bonus: ${Math.floor(bonus * 100)}%`
    } else if (new Set(newSlots).size === 2) {
      winAmount = bet * 2 // Partial match
      resultMessage = 'Two symbols match!'
    } else {
      winAmount = -bet // No match
      resultMessage = 'No matches. Better luck next time!'
    }

    incrementCoins(winAmount)
    playGame()
    setGameCooldown('slotMachine')
    completeTask('play-slot-machine')

    const newConsecutivePlays = winAmount > 0 ? consecutivePlays + 1 : 0
    setConsecutivePlays(newConsecutivePlays)
    localStorage.setItem('slotMachineConsecutivePlays', newConsecutivePlays.toString())

    const newHistory = [{ result: resultMessage, amount: winAmount }, ...gameHistory.slice(0, 9)]
    saveHistory(newHistory)

    // Check for milestones
    if (newConsecutivePlays === 3) {
      completeTask('slot-machine-streak')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-purple-900 p-4 text-white">
      <Link href="/">
        <Button variant="ghost" size="sm" className="text-white absolute top-4 left-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      <Card className="w-full max-w-md mx-auto mt-16">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Slot Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4 text-center">Balance: {stats.totalCoins.toLocaleString()} coins</p>

          {cooldownRemaining > 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Cooldown Active</AlertTitle>
              <AlertDescription>
                Next game available in: {Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <input
                type="number"
                placeholder="Enter Bet"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                className="w-full p-2 rounded bg-white text-black mb-4"
              />
              <div className="flex justify-center gap-4 text-6xl mb-4">
                {slots.map((slot, index) => (
                  <span key={index} className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded">
                    {slot || '❓'}
                  </span>
                ))}
              </div>
              <Button onClick={spin} className="w-full">Spin</Button>
              <p className="text-sm mt-4 text-center">Consecutive Wins: {consecutivePlays}</p>
            </>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Game History</h2>
            <ul className="space-y-2">
              {gameHistory.map((game, index) => (
                <li key={index} className={game.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                  {game.result} ({game.amount > 0 ? '+' : ''}{game.amount} coins)
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}