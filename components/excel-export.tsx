"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ExcelExport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = (type: string) => {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      setLoading(false)
      setError(
        "La funcionalidad de exportación a Excel requiere la biblioteca 'xlsx'. Por favor, instálala con 'npm install xlsx' o 'yarn add xlsx'.",
      )
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Datos a Excel</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleExport("properties")} disabled={loading}>
              Exportar Propiedades
            </Button>
            <Button onClick={() => handleExport("persons")} disabled={loading}>
              Exportar Personas
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleExport("receipts")} disabled={loading}>
              Exportar Recibos
            </Button>
            <Button onClick={() => handleExport("all")} disabled={loading} variant="default">
              Exportar Todo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
