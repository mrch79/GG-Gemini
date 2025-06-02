"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ExcelImport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = () => {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      setLoading(false)
      setError(
        "La funcionalidad de importación de Excel requiere la biblioteca 'xlsx'. Por favor, instálala con 'npm install xlsx' o 'yarn add xlsx'.",
      )
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Datos desde Excel</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="properties">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="persons">Personas</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="mt-4">
              <p className="text-sm mb-2">
                Seleccione un archivo Excel con las siguientes columnas: propiedad, tipo, direccion, localidad
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleFileChange} disabled={loading}>
                  Seleccionar Archivo
                </Button>
                <span className="text-sm text-gray-500">{loading ? "Importando..." : "Formatos: .xlsx, .xls"}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="persons" className="space-y-4">
            <div className="mt-4">
              <p className="text-sm mb-2">
                Seleccione un archivo Excel con las siguientes columnas: nombre, cuit, tipo (locador/locatario)
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleFileChange} disabled={loading}>
                  Seleccionar Archivo
                </Button>
                <span className="text-sm text-gray-500">{loading ? "Importando..." : "Formatos: .xlsx, .xls"}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
