'use client';

import { ArrowLeft, Coins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStats } from '@/context/StatsProvider';

export default function Boost() {
  const { stats, purchaseAutoClicker, incrementMultiplier } = useStats();

  const autoClickerCost = 100 * (3 ** stats.autoClickers.length);
  const hasActiveClickers = stats.autoClickers.some((clicker) => !clicker.expired);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-purple-900">
      <header className="flex justify-between items-center p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
        <span className="text-white font-bold">Boost</span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <div className="text-white text-center mb-8">
          <p className="text-2xl">Current Multiplier: x{stats.multiplier}</p>
          <p className="flex items-center justify-center mt-2">
            <Coins className="w-5 h-5 mr-2 text-yellow-400" />
            {stats.totalCoins.toLocaleString()}
          </p>
          <p className="text-lg mt-4">Auto-Clickers: {stats.autoClickers.length}</p>
        </div>

        <div className="space-y-4 w-full max-w-sm">
          {/* Auto-Clicker Button */}
          <Button
            onClick={purchaseAutoClicker}
            disabled={stats.totalCoins < autoClickerCost || hasActiveClickers}
            className="w-full"
          >
            Buy Auto-Clicker (Cost: {autoClickerCost.toLocaleString()} coins)
          </Button>

          {hasActiveClickers && (
            <p className="text-sm text-yellow-400 text-center">
              You must wait for existing Auto-Clickers to expire before purchasing more.
            </p>
          )}

          {/* Upgrade Multiplier Button */}
          <Button
            onClick={incrementMultiplier}
            disabled={stats.totalCoins < stats.multiplierCost}
            className="w-full"
          >
            Upgrade Multiplier (Cost: {stats.multiplierCost.toLocaleString()} coins)
          </Button>
        </div>
      </main>

      <Link href="/">
        <Button variant="ghost" className="mt-6 text-white">
          ← Back to Home
        </Button>
      </Link>
    </div>
  );
}
