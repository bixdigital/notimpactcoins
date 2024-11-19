'use client'

import { useState, useEffect } from 'react'
import { Gift, ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useStats } from '@/context/StatsProvider'

export default function Referral() {
  const [referralCode] = useState('NOTIMPACT123')
  const [referralHistory, setReferralHistory] = useState<string[]>([])
  const { addReferral } = useStats()

  useEffect(() => {
    const savedHistory = localStorage.getItem('referralHistory')
    if (savedHistory) {
      setReferralHistory(JSON.parse(savedHistory))
    }
  }, [])

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "Referral Code Copied!",
      description: "Share this code with your friends to earn rewards.",
    })
  }

  const handleReferral = () => {
    addReferral()
    const newHistory = [`Friend joined using your code! (+500 coins)`, ...referralHistory.slice(0, 9)]
    setReferralHistory(newHistory)
    localStorage.setItem('referralHistory', JSON.stringify(newHistory))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-purple-900">
      <header className="flex justify-between items-center p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
        <span className="text-white font-bold">Referral Program</span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <Gift className="w-16 h-16 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white text-center">Invite Friends, Earn Rewards!</h1>
        <p className="text-white text-center max-w-md">
          Share your referral code with friends. When they sign up, you&apos;ll both receive bonus coins!
        </p>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input value={referralCode} readOnly className="bg-white" />
          <Button onClick={copyReferralCode}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>

        <Button onClick={handleReferral} className="mt-4">Simulate Referral</Button>

        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Referral History</h2>
          <ul className="space-y-2">
            {referralHistory.map((entry, index) => (
              <li key={index} className="text-white">{entry}</li>
            ))}
          </ul>
        </div>
      </main>

      <Link href="/">
        <Button variant="ghost" className="mt-8 text-white">
          ← Back to Home
        </Button>
      </Link>
    </div>
  )
}