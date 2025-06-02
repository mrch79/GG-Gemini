"use client"

import type React from "react"

import { useState } from "react"
import { importPropertiesFromCSV, importLocadoresFromCSV, importLocatariosFromCSV } from "../actions/csv-import"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function CSVImportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)

  const handleImport = async (
    e: React.FormEvent<HTMLFormElement>,
    importFunction: (formData: FormData) => Promise<{ success: boolean; message: string; count?: number }>,
  ) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await importFunction(formData)
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al importar datos",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Importar datos desde CSV</CardTitle>
        <CardDescription>Carga archivos CSV para importar propiedades, locadores o locatarios</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="properties">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="locadores">Locadores</TabsTrigger>
            <TabsTrigger value="locatarios">Locatarios</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <form onSubmit={(e) => handleImport(e, importPropertiesFromCSV)} className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  El archivo CSV debe contener las columnas: propiedad, tipo, direccion, localidad
                </p>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="properties-csv" className="text-sm font-medium">
                    Archivo CSV de propiedades
                  </label>
                  <input
                    id="properties-csv"
                    name="file"
                    type="file"
                    accept=".csv"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Importando..." : "Importar propiedades"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="locadores">
            <form onSubmit={(e) => handleImport(e, importLocadoresFromCSV)} className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">El archivo CSV debe contener las columnas: nombre, cuit</p>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="locadores-csv" className="text-sm font-medium">
                    Archivo CSV de locadores
                  </label>
                  <input
                    id="locadores-csv"
                    name="file"
                    type="file"
                    accept=".csv"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Importando..." : "Importar locadores"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="locatarios">
            <form onSubmit={(e) => handleImport(e, importLocatariosFromCSV)} className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">El archivo CSV debe contener las columnas: nombre, cuit</p>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="locatarios-csv" className="text-sm font-medium">
                    Archivo CSV de locatarios
                  </label>
                  <input
                    id="locatarios-csv"
                    name="file"
                    type="file"
                    accept=".csv"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Importando..." : "Importar locatarios"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Asegúrate de que los archivos CSV tengan el formato correcto antes de importarlos.
        </p>
      </CardFooter>
    </Card>
  )
}
