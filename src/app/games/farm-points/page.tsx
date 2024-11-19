'use client';

import { useEffect, useState } from 'react';
import { useStats } from '@/context/StatsProvider';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import Link from 'next/link';

const FARMING_DURATION = 3 * 60 * 60; // 3 hours in seconds
const MAX_REWARDS = 400; // Maximum coins that can be farmed

export default function FarmingGame() {
  const { stats, incrementCoins } = useStats();
  const [isFarming, setIsFarming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [reward, setReward] = useState(0);
  const [totalFarmed, setTotalFarmed] = useState(0);
  const [canHarvest, setCanHarvest] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('farmingProgress');
    if (savedProgress) {
      const { progress, timeElapsed, reward, totalFarmed, isFarming, canHarvest } = JSON.parse(savedProgress);
      setProgress(progress);
      setTimeElapsed(timeElapsed);
      setReward(reward);
      setTotalFarmed(totalFarmed);
      setIsFarming(isFarming);
      setCanHarvest(canHarvest);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isFarming && timeElapsed < FARMING_DURATION) {
      intervalId = setInterval(() => {
        setTimeElapsed((prev) => {
          const updatedTime = prev + 1;
          if (updatedTime >= FARMING_DURATION) {
            clearInterval(intervalId!);
            setIsFarming(false);
            setCanHarvest(true);
          }
          return updatedTime;
        });

        const progressPercentage = ((timeElapsed + 1) / FARMING_DURATION) * 100;
        setProgress(progressPercentage);

        const coinsEarned = 400 / FARMING_DURATION; // Spread 400 coins across 3 hours
        setReward((prev) => Math.min(prev + coinsEarned, MAX_REWARDS)); // Cap rewards at 400
        incrementCoins(coinsEarned); // Increment global coins
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFarming, timeElapsed, stats.multiplier, incrementCoins]);

  useEffect(() => {
    localStorage.setItem(
      'farmingProgress',
      JSON.stringify({ progress, timeElapsed, reward, totalFarmed, isFarming, canHarvest })
    );
  }, [progress, timeElapsed, reward, totalFarmed, isFarming, canHarvest]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hrs = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}h ${remainingMinutes
      .toString()
      .padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  };

  const startFarming = () => {
    setIsFarming(true);
    setTimeElapsed(0);
    setProgress(0);
    setReward(0);
  };

  const harvestRewards = () => {
    setTotalFarmed((prev) => prev + reward);
    setReward(0);
    setCanHarvest(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white">
      <Header title="Farm Points" showBackButton />

      <main className="flex-1 p-4 space-y-6">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Farm Points</h2>
            <p className="text-muted-foreground">
              Earn rewards by farming points for a limited duration.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Elapsed</p>
              <p className="text-lg font-bold">{formatTime(timeElapsed)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
              <p className="text-lg font-bold text-yellow-400">
                ⭐ {reward.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full text-lg rounded-lg"
              variant={isFarming ? 'destructive' : 'default'}
              onClick={startFarming}
              disabled={isFarming || canHarvest}
            >
              {isFarming ? 'Farming...' : 'Start Farming'}
            </Button>

            <Button
              className="w-full text-lg rounded-lg"
              variant="outline"
              onClick={harvestRewards}
              disabled={!canHarvest}
            >
              {canHarvest ? 'Harvest Rewards' : 'Not Ready to Harvest'}
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">Your Stats</h3>
          <p>Total Farmed: <span className="font-bold">{totalFarmed.toFixed(3)}</span> coins</p>
          <p>Current Multiplier: <span className="font-bold">x{stats.multiplier}</span></p>
        </Card>
      </main>

      <footer className="p-4">
        <Link href="/">
          <Button variant="ghost" className="w-full">
            ← Back to Home
          </Button>
        </Link>
      </footer>
    </div>
  );
}
