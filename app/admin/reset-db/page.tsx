"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ResetDbPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleReset = async () => {
    if (!confirm("¿Estás seguro de que deseas reiniciar la base de datos? Esta acción eliminará TODOS los datos.")) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/reset-db", {
        method: "POST",
      })

      const data = await response.json()
      setResult({
        success: data.success,
        message: data.success
          ? "Base de datos reiniciada correctamente"
          : data.error || "Error al reiniciar la base de datos",
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Error al reiniciar la base de datos",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AdmiGG - Reiniciar Base de Datos</h1>
        <Button asChild>
          <Link href="/admin">Volver al Panel de Administración</Link>
        </Button>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reiniciar Base de Datos</CardTitle>
          <CardDescription>
            Esta acción eliminará TODOS los datos de la aplicación y creará una base de datos vacía.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-red-600 font-medium">
              ¡ADVERTENCIA! Esta acción no se puede deshacer. Todos los recibos, propiedades y personas serán
              eliminados.
            </p>

            {result && (
              <Alert
                className={
                  result.success
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }
              >
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleReset} disabled={loading} className="w-full">
            {loading ? "Reiniciando..." : "Reiniciar Base de Datos"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
