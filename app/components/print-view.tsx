"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintViewProps {
  children: React.ReactNode
  title?: string
}

export default function PrintView({ children, title = "Imprimir documento" }: PrintViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="print-controls no-print mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button onClick={handlePrint} className="print-button">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="print-content">{children}</div>
    </div>
  )
}
