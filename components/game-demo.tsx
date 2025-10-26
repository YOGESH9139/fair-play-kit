"use client"

import { useState } from "react"

interface GameResult {
  id: number
  bet: number
  playerChoice: string
  computerChoice: string
  result: "win" | "lose" | "draw"
  multiplier: number
  timestamp: Date
}

const CHOICES = ["Rock", "Paper", "Scissors"]
const CHOICE_EMOJIS: Record<string, string> = {
  Rock: "🪨",
  Paper: "📄",
  Scissors: "✂️",
}

export function GameDemo() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState(10)
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  const determineWinner = (player: string, computer: string): "win" | "lose" | "draw" => {
    if (player === computer) return "draw"
    if (
      (player === "Rock" && computer === "Scissors") ||
      (player === "Paper" && computer === "Rock") ||
      (player === "Scissors" && computer === "Paper")
    ) {
      return "win"
    }
    return "lose"
  }

  const playGame = async (choice: string) => {
    if (betAmount > balance || isPlaying) return

    setSelectedChoice(choice)
    setIsPlaying(true)

    // Simulate game play with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)]
    const result = determineWinner(choice, computerChoice)

    let multiplier = 0
    let newBalance = balance

    if (result === "win") {
      multiplier = 2
      newBalance = balance + betAmount
    } else if (result === "draw") {
      multiplier = 1
      newBalance = balance
    } else {
      multiplier = 0
      newBalance = balance - betAmount
    }

    const gameResult: GameResult = {
      id: gameResults.length + 1,
      bet: betAmount,
      playerChoice: choice,
      computerChoice,
      result,
      multiplier,
      timestamp: new Date(),
    }

    setGameResults([gameResult, ...gameResults])
    setBalance(newBalance)
    setIsPlaying(false)
    setSelectedChoice(null)
  }

  return (
    <div className="space-y-8">
      {/* Game Controls */}
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Your Balance</span>
            <span className="text-3xl font-bold text-primary">{balance} ALGO</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bet Amount (ALGO)</label>
            <input
              type="number"
              min="1"
              max={balance}
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, Number.parseInt(e.target.value) || 0))}
              disabled={isPlaying}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Choose Your Move</label>
            <div className="grid grid-cols-3 gap-3">
              {CHOICES.map((choice) => (
                <button
                  key={choice}
                  onClick={() => playGame(choice)}
                  disabled={isPlaying || betAmount > balance}
                  className={`py-4 px-3 rounded-lg font-bold transition-all ${
                    selectedChoice === choice && isPlaying
                      ? "bg-primary text-primary-foreground scale-95"
                      : "bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="text-2xl mb-1">{CHOICE_EMOJIS[choice]}</div>
                  <div className="text-xs">{choice}</div>
                </button>
              ))}
            </div>
          </div>

          {isPlaying && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground animate-pulse">Playing... Computer is choosing...</p>
            </div>
          )}
        </div>
      </div>

      {/* Game Results */}
      {gameResults.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-bold text-foreground">Game History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {gameResults.map((result) => (
              <div
                key={result.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  result.result === "win"
                    ? "bg-green-50 border-green-200"
                    : result.result === "draw"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{result.result === "win" ? "✓" : result.result === "draw" ? "=" : "✗"}</div>
                  <div>
                    <p
                      className={`font-bold ${
                        result.result === "win"
                          ? "text-green-700"
                          : result.result === "draw"
                            ? "text-blue-700"
                            : "text-red-700"
                      }`}
                    >
                      {result.result === "win" ? "Won" : result.result === "draw" ? "Draw" : "Lost"} {result.bet} ALGO
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {CHOICE_EMOJIS[result.playerChoice]} vs {CHOICE_EMOJIS[result.computerChoice]} •{" "}
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-lg font-bold ${
                    result.result === "win"
                      ? "text-green-700"
                      : result.result === "draw"
                        ? "text-blue-700"
                        : "text-red-700"
                  }`}
                >
                  {result.result === "win" ? "+" : result.result === "draw" ? "±" : "-"}
                  {result.bet * result.multiplier} ALGO
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
