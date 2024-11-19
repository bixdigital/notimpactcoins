'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStats } from '@/context/StatsProvider';
import { ArrowLeft, AlertCircle, Dice1Icon as Dice } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DiceRollGame() {
  const [betAmount, setBetAmount] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{ result: string; amount: number }>>([]);
  const { stats, incrementCoins, playGame, checkGameCooldown, setGameCooldown, completeTask } = useStats();
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [consecutivePlays, setConsecutivePlays] = useState(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem('diceRollHistory');
    const savedConsecutivePlays = localStorage.getItem('diceRollConsecutivePlays');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
    if (savedConsecutivePlays) {
      setConsecutivePlays(Number(savedConsecutivePlays));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (checkGameCooldown('diceRoll')) {
        setCooldownRemaining(0);
      } else {
        const lastPlayed = stats.gameCooldowns.diceRoll;
        const remaining = Math.max(0, 3600000 - (Date.now() - lastPlayed));
        setCooldownRemaining(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stats.gameCooldowns.diceRoll, checkGameCooldown]);

  const saveHistory = (newHistory: Array<{ result: string; amount: number }>) => {
    setGameHistory(newHistory);
    localStorage.setItem('diceRollHistory', JSON.stringify(newHistory));
  };

  const handleRoll = () => {
    if (!checkGameCooldown('diceRoll')) {
      alert('You need to wait before playing again!');
      return;
    }

    if (stats.totalCoins < betAmount) {
      alert('Not enough coins to bet!');
      return;
    }

    if (guess === null || guess < 1 || guess > 6) {
      alert('Please enter a valid guess between 1 and 6');
      return;
    }

    const dice = Math.ceil(Math.random() * 6);
    setRollResult(dice);

    let resultMessage: string;
    let amountChange: number;

    if (dice === guess) {
      const bonus = Math.min(consecutivePlays, 5) * 0.2; // Up to 100% bonus for consecutive plays
      amountChange = Math.floor(betAmount * (5 + bonus)); // Base payout is 5x for correct guess
      incrementCoins(amountChange);
      resultMessage = `You won! The dice rolled ${dice}. Bonus: ${Math.floor(bonus * 100)}%`;
    } else {
      amountChange = -betAmount;
      incrementCoins(amountChange);
      resultMessage = `You lost! The dice rolled ${dice}.`;
    }

    playGame();
    setGameCooldown('diceRoll');
    completeTask('play-dice-roll');

    const newConsecutivePlays = dice === guess ? consecutivePlays + 1 : 0;
    setConsecutivePlays(newConsecutivePlays);
    localStorage.setItem('diceRollConsecutivePlays', newConsecutivePlays.toString());

    const newHistory = [{ result: resultMessage, amount: amountChange }, ...gameHistory.slice(0, 9)];
    saveHistory(newHistory);

    // Check for milestones
    if (newConsecutivePlays === 3) {
      completeTask('dice-roll-streak');
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
          <CardTitle className="text-2xl font-bold text-center">Dice Roll</CardTitle>
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

              <input
                type="number"
                value={guess || ''}
                onChange={(e) => setGuess(Number(e.target.value))}
                placeholder="Enter your guess (1-6)"
                className="w-full p-2 text-black rounded mb-4"
              />

              <Button onClick={handleRoll} className="w-full mb-4">
                <Dice className="mr-2 h-4 w-4" />
                Roll Dice
              </Button>

              {rollResult !== null && (
                <Alert variant={rollResult === guess ? 'default' : 'destructive'}>
                  <AlertTitle>{rollResult === guess ? 'Victory!' : 'Defeat'}</AlertTitle>
                  <AlertDescription>Dice landed on: {rollResult}</AlertDescription>
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