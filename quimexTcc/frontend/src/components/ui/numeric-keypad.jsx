"use client"

import { useState } from "react"
import { Delete } from "lucide-react"

export default function NumericKeypad() {
  const [display, setDisplay] = useState("0")

  const handleNumber = (num) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num))
  }

  const handleClear = () => {
    setDisplay("0")
  }

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
  }

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "←"]

  return (
    <div className="space-y-3">
      <div className="bg-background border border-border rounded-lg p-3 text-right">
        <p className="text-xs text-muted-foreground mb-1">Valor digitado</p>
        <p className="text-2xl font-bold font-mono text-foreground">R$ {display}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "C") handleClear()
              else if (btn === "←") handleBackspace()
              else handleNumber(btn)
            }}
            className={`h-12 rounded-lg font-semibold transition-colors ${
              btn === "C"
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : btn === "←"
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {btn === "←" ? <Delete className="h-4 w-4 mx-auto" /> : btn}
          </button>
        ))}
      </div>
    </div>
  )
}
