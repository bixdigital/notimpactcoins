'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, CheckCircle, Coins, Flame, BarChart2, Trophy, Gamepad2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useStats } from '@/context/StatsProvider';
import Image from 'next/image';

export default function Home() {
  const { stats, incrementTaps, incrementCoins } = useStats();

  const handleTap = () => {
    incrementTaps();
    incrementCoins(stats?.multiplier ?? 1);
  };

  const games = [
    { name: 'Coin Flip', path: './games/coin-flip' },
    { name: 'Dice Roll', path: './games/dice-roll' },
    { name: 'Slot Machine', path: './games/slot-machine' },
    { name: 'Farm Points', path: './games/farm-points' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-purple-900">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="lg" className="text-white">
          X
        </Button>
        <span className="text-white font-bold text-lg">NotImpactCoin</span>
        <Button variant="ghost" size="lg" className="text-white">
          ⋮
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Coins Display */}
        <div className="text-white text-3xl font-bold flex items-center gap-3">
          <Coins className="text-yellow-400 w-8 h-8" />
          {stats?.totalCoins?.toLocaleString() ?? '0'}
        </div>

        {/* Multiplier */}
        <div className="flex items-center gap-3 text-white text-lg">
          <Trophy className="text-yellow-700 w-6 h-6" />
          <span>Multiplier: x{stats?.multiplier ?? 1}</span>
        </div>

        {/* Clickable Image */}
        <motion.div
          className="w-48 h-48 flex items-center justify-center shadow-2xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTap}
        >
          <Image
            src="/notimpactcoin.png"
            alt="Clickable"
            className="w-full h-full rounded-full object-cover"
          />
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-md px-4">
          <div className="flex justify-between text-white text-lg mb-3">
            <span>Auto-Clickers: {stats?.totalBoosts ?? 0}</span>
            <span>Coins Progress</span>
          </div>
          <Progress value={(stats?.totalCoins ?? 0) % 1000 / 10} className="h-4" />
        </div>
      </main>

      {/* Navigation */}
      <nav className="grid grid-cols-6 gap-4 p-4 bg-purple-950/50">
        {[
          { icon: Gift, label: 'Ref', href: './referral' },
          { icon: CheckCircle, label: 'Task', href: './task' },
          { icon: Coins, label: 'Tap', href: './' },
          { icon: Flame, label: 'Boost', href: './boost' },
          { icon: BarChart2, label: 'Stats', href: './stats' },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-3 w-full h-full">
              <Icon className="w-8 h-8 text-white" />
              <span className="text-sm text-white">{label}</span>
            </Button>
          </Link>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-3 w-full h-full">
              <Gamepad2 className="w-8 h-8 text-white" />
              <span className="text-sm text-white">Games</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-full">
            <DialogHeader>
              <DialogTitle>Choose a Game</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {games.map(game => (
                <Link
                  key={game.path}
                  href={game.path}
                  className="flex items-center p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-lg"
                >
                  <Gamepad2 className="w-6 h-6 mr-3" />
                  {game.name}
                </Link>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
}
