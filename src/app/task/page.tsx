'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from 'next/link'
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import { useStats } from '@/context/StatsProvider'

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

export default function Tasks() {
  const { stats, completeTask } = useStats()
  const [timeUntilReset, setTimeUntilReset] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeUntilReset(`${hours}h ${minutes}m`)
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId)
  }

  const canCompleteDaily = (task: Task) => {
    if (!task.lastCompleted) return true
    const lastCompleted = new Date(task.lastCompleted).setHours(0, 0, 0, 0)
    const today = new Date().setHours(0, 0, 0, 0)
    return lastCompleted < today
  }

  const renderTask = (task: Task) => (
    <Card key={task.id} className="mb-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <Button
          variant={task.completed ? 'secondary' : 'default'}
          disabled={task.completed || (task.type === 'daily' && !canCompleteDaily(task))}
          onClick={() => handleCompleteTask(task.id)}
          className="h-8 w-full sm:w-24"
        >
          {task.completed ? (
            <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {task.completed ? 'Done' : `${task.reward} 🪙`}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{task.description}</p>
        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline mt-2 inline-flex items-center"
          >
            Complete task <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-purple-900 p-4 sm:p-6">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </Link>

      <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 mt-12 sm:mt-0">Tasks</h1>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-base sm:text-lg mb-2">Current Balance: {stats.totalCoins.toLocaleString()} 🪙</p>
          <p className="text-sm text-muted-foreground">Daily tasks reset in: {timeUntilReset}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          {stats.tasks.filter(task => task.type === 'daily').map(renderTask)}
        </TabsContent>
        <TabsContent value="social">
          {stats.tasks.filter(task => task.type === 'social').map(renderTask)}
        </TabsContent>
        <TabsContent value="achievement">
          {stats.tasks.filter(task => task.type === 'achievement').map(renderTask)}
        </TabsContent>
      </Tabs>
    </div>
  )
}