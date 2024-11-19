'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AutoClicker {
  cost: number;
  earnings: number;
  expired: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'daily' | 'social' | 'achievement';
  link?: string;
  lastCompleted?: number;
}

interface GameCooldown {
  coinFlip: number;
  diceRoll: number;
  slotMachine: number;
}

interface StatsData {
  totalTaps: number;
  totalBoosts: number;
  totalCoins: number;
  multiplier: number;
  currentLevel: string;
  autoClickers: AutoClicker[];
  multiplierCost: number;
  tasksCompleted: number;
  referrals: number;
  gamesPlayed: number;
  totalRewardsEarned: number;
  tasks: Task[];
  lastDailyLogin: number;
  gameCooldowns: GameCooldown;
}

interface StatsContextProps {
  stats: StatsData;
  incrementTaps: () => void;
  incrementCoins: (amount: number) => void;
  incrementBoosts: () => void;
  incrementMultiplier: () => void;
  purchaseAutoClicker: () => void;
  completeTask: (taskId: string) => void;
  addReferral: () => void;
  playGame: () => void;
  setLevel: (level: string) => void;
  resetStats: () => void;
  checkGameCooldown: (game: keyof GameCooldown) => boolean;
  setGameCooldown: (game: keyof GameCooldown) => void;
}

const StatsContext = createContext<StatsContextProps | undefined>(undefined);

const STORAGE_KEY = 'notImpactCoinStats';

const initialStats: StatsData = {
  totalTaps: 0,
  totalBoosts: 0,
  totalCoins: 1000,
  multiplier: 1,
  currentLevel: 'Bronze',
  autoClickers: [],
  multiplierCost: 500,
  tasksCompleted: 0,
  referrals: 0,
  gamesPlayed: 0,
  totalRewardsEarned: 0,
  tasks: [
    {
      id: 'daily-login',
      title: 'Daily Login',
      description: 'Log in daily to earn rewards',
      reward: 50,
      completed: false,
      type: 'daily',
    },
    {
      id: 'play-coin-flip',
      title: 'Play Coin Flip',
      description: 'Play a game of Coin Flip',
      reward: 20,
      completed: false,
      type: 'daily',
    },
    {
      id: 'play-dice-roll',
      title: 'Play Dice Roll',
      description: 'Play a game of Dice Roll',
      reward: 20,
      completed: false,
      type: 'daily',
    },
    {
      id: 'play-slot-machine',
      title: 'Play Slot Machine',
      description: 'Play a game on the Slot Machine',
      reward: 20,
      completed: false,
      type: 'daily',
    },
    {
      id: 'twitter-follow',
      title: 'Follow on Twitter',
      description: 'Follow NotImpactCoin on Twitter',
      reward: 100,
      completed: false,
      type: 'social',
      link: 'https://twitter.com/NotImpactCoin',
    },
    {
      id: 'discord-join',
      title: 'Join Discord',
      description: 'Join the NotImpactCoin Discord community',
      reward: 100,
      completed: false,
      type: 'social',
      link: 'https://discord.gg/notimpactcoin',
    },
    {
      id: 'telegram-join',
      title: 'Join Telegram',
      description: 'Join the NotImpactCoin Telegram group',
      reward: 100,
      completed: false,
      type: 'social',
      link: 'https://t.me/notimpactcoin',
    },
    {
      id: 'reach-1000-coins',
      title: 'Coin Collector',
      description: 'Accumulate 1,000 coins',
      reward: 200,
      completed: false,
      type: 'achievement',
    },
    {
      id: 'reach-10-referrals',
      title: 'Social Butterfly',
      description: 'Refer 10 friends to NotImpactCoin',
      reward: 500,
      completed: false,
      type: 'achievement',
    },
    {
      id: 'coin-flip-streak',
      title: 'Coin Flip Maestro',
      description: 'Win 5 consecutive Coin Flip games',
      reward: 500,
      completed: false,
      type: 'achievement',
    },
    {
      id: 'dice-roll-streak',
      title: 'Dice Roll Expert',
      description: 'Win 3 consecutive Dice Roll games',
      reward: 500,
      completed: false,
      type: 'achievement',
    },
    {
      id: 'slot-machine-streak',
      title: 'Slot Machine Wizard',
      description: 'Win 3 consecutive Slot Machine games',
      reward: 500,
      completed: false,
      type: 'achievement',
    },
  ],
  lastDailyLogin: 0,
  gameCooldowns: {
    coinFlip: 0,
    diceRoll: 0,
    slotMachine: 0,
  },
};

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<StatsData>(initialStats);

  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newClickers = prev.autoClickers.map((clicker) => {
          if (clicker.expired) return clicker;
          const newEarnings = clicker.earnings + prev.multiplier;
          const expired = newEarnings >= clicker.cost * 3;
          return { ...clicker, earnings: newEarnings, expired };
        });

        const activeEarnings = newClickers
          .filter((clicker) => !clicker.expired)
          .reduce((sum) => sum + prev.multiplier, 0);

        return {
          ...prev,
          totalCoins: prev.totalCoins + activeEarnings,
          autoClickers: newClickers,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = Date.now();
    const lastLoginDate = new Date(stats.lastDailyLogin).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);

    if (lastLoginDate < today) {
      setStats(prev => ({
        ...prev,
        lastDailyLogin: now,
        tasks: prev.tasks.map(task => 
          task.type === 'daily' ? { ...task, completed: false, lastCompleted: undefined } : task
        ),
      }));
    }
  }, [stats.lastDailyLogin]);

  const updateStats = useCallback((updater: (prev: StatsData) => StatsData) => {
    setStats((prev) => {
      const newStats = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const incrementTaps = useCallback(() => {
    updateStats((prev) => ({
      ...prev,
      totalTaps: prev.totalTaps + 1,
      totalCoins: prev.totalCoins + prev.multiplier,
    }));
  }, [updateStats]);

  const incrementCoins = useCallback((amount: number) => {
    updateStats((prev) => ({
      ...prev,
      totalCoins: prev.totalCoins + amount,
    }));
  }, [updateStats]);

  const incrementBoosts = useCallback(() => {
    updateStats((prev) => ({
      ...prev,
      totalBoosts: prev.totalBoosts + 1,
    }));
  }, [updateStats]);

  const incrementMultiplier = useCallback(() => {
    updateStats((prev) => {
      if (prev.totalCoins >= prev.multiplierCost) {
        return {
          ...prev,
          totalCoins: prev.totalCoins - prev.multiplierCost,
          multiplier: prev.multiplier + 1,
          multiplierCost: prev.multiplierCost * 3,
        };
      }
      return prev;
    });
  }, [updateStats]);

  const purchaseAutoClicker = useCallback(() => {
    updateStats((prev) => {
      const cost = 100 * (3 ** prev.autoClickers.length);
      if (prev.totalCoins >= cost) {
        return {
          ...prev,
          totalCoins: prev.totalCoins - cost,
          totalBoosts: prev.totalBoosts + 1,
          autoClickers: [...prev.autoClickers, { cost, earnings: 0, expired: false }],
        };
      }
      return prev;
    });
  }, [updateStats]);

  const completeTask = useCallback((taskId: string) => {
    updateStats((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1 || prev.tasks[taskIndex].completed) return prev;

      const updatedTasks = [...prev.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        completed: true,
        lastCompleted: Date.now(),
      };

      return {
        ...prev,
        totalCoins: prev.totalCoins + prev.tasks[taskIndex].reward,
        tasksCompleted: prev.tasksCompleted + 1,
        totalRewardsEarned: prev.totalRewardsEarned + prev.tasks[taskIndex].reward,
        tasks: updatedTasks,
      };
    });
  }, [updateStats]);

  const addReferral = useCallback(() => {
    updateStats((prev) => ({
      ...prev,
      referrals: prev.referrals + 1,
      totalCoins: prev.totalCoins + 500,
      totalRewardsEarned: prev.totalRewardsEarned + 500,
    }));
  }, [updateStats]);

  const playGame = useCallback(() => {
    updateStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, [updateStats]);

  const setLevel = useCallback((level: string) => {
    updateStats((prev) => ({
      ...prev,
      currentLevel: level,
    }));
  }, [updateStats]);

  const resetStats = useCallback(() => {
    setStats(initialStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats));
  }, []);

  const checkGameCooldown = useCallback((game: keyof GameCooldown) => {
    const now = Date.now();
    const lastPlayed = stats.gameCooldowns[game];
    return now - lastPlayed >= 3600000; // 1 hour in milliseconds
  }, [stats.gameCooldowns]);

  const setGameCooldown = useCallback((game: keyof GameCooldown) => {
    updateStats((prev) => ({
      ...prev,
      gameCooldowns: {
        ...prev.gameCooldowns,
        [game]: Date.now(),
      },
    }));
  }, [updateStats]);

  return (
    <StatsContext.Provider
      value={{
        stats,
        incrementTaps,
        incrementCoins,
        incrementBoosts,
        incrementMultiplier,
        purchaseAutoClicker,
        completeTask,
        addReferral,
        playGame,
        setLevel,
        resetStats,
        checkGameCooldown,
        setGameCooldown,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = (): StatsContextProps => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};