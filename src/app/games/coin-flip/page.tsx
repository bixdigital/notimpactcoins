'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStats } from '@/context/StatsProvider';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState(0);
  const [flipResult, setFlipResult] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{ result: string; amount: number }>>([]);
  const { stats, incrementCoins, playGame, checkGameCooldown, setGameCooldown, completeTask } = useStats();
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [consecutivePlays, setConsecutivePlays] = useState(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem('coinFlipHistory');
    const savedConsecutivePlays = localStorage.getItem('coinFlipConsecutivePlays');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
    if (savedConsecutivePlays) {
      setConsecutivePlays(Number(savedConsecutivePlays));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (checkGameCooldown('coinFlip')) {
        setCooldownRemaining(0);
      } else {
        const lastPlayed = stats.gameCooldowns.coinFlip;
        const remaining = Math.max(0, 3600000 - (Date.now() - lastPlayed));
        setCooldownRemaining(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stats.gameCooldowns.coinFlip, checkGameCooldown]);

  const saveHistory = (newHistory: Array<{ result: string; amount: number }>) => {
    setGameHistory(newHistory);
    localStorage.setItem('coinFlipHistory', JSON.stringify(newHistory));
  };

  const handleFlip = (choice: 'heads' | 'tails') => {
    if (!checkGameCooldown('coinFlip')) {
      alert('You need to wait before playing again!');
      return;
    }

    if (stats.totalCoins < betAmount) {
      alert('Not enough coins to bet!');
      return;
    }

    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
    let resultMessage: string;
    let amountChange: number;

    if (outcome === choice) {
      const bonus = Math.min(consecutivePlays, 5) * 0.1; // Up to 50% bonus for consecutive plays
      amountChange = Math.floor(betAmount * (1 + bonus));
      incrementCoins(amountChange);
      resultMessage = `You won! ${outcome} was correct. Bonus: ${Math.floor(bonus * 100)}%`;
    } else {
      amountChange = -betAmount;
      incrementCoins(-betAmount);
      resultMessage = `You lost! It was ${outcome}.`;
    }

    setFlipResult(resultMessage);
    playGame();
    setGameCooldown('coinFlip');
    completeTask('play-coin-flip');

    const newConsecutivePlays = outcome === choice ? consecutivePlays + 1 : 0;
    setConsecutivePlays(newConsecutivePlays);
    localStorage.setItem('coinFlipConsecutivePlays', newConsecutivePlays.toString());

    const newHistory = [{ result: resultMessage, amount: amountChange }, ...gameHistory.slice(0, 9)];
    saveHistory(newHistory);

    // Check for milestones
    if (newConsecutivePlays === 5) {
      completeTask('coin-flip-streak');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-950 to-purple-900 text-white p-4">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Coin Flip</CardTitle>
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
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                placeholder="Enter bet amount"
                className="w-full p-2 text-black rounded mb-4"
              />

              <div className="flex gap-4 justify-center mb-4">
                <Button onClick={() => handleFlip('heads')}>Heads</Button>
                <Button onClick={() => handleFlip('tails')}>Tails</Button>
              </div>

              {flipResult && (
                <Alert variant={flipResult.includes('won') ? 'default' : 'destructive'}>
                  <AlertTitle>{flipResult.includes('won') ? 'Victory!' : 'Defeat'}</AlertTitle>
                  <AlertDescription>{flipResult}</AlertDescription>
                </Alert>
              )}

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
  );
}