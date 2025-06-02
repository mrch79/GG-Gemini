"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import ExportButton from "./export-button"

interface Person {
  id: string
  nombre: string
  cuit: string
  tipo: "locador" | "locatario"
  created_at?: string
}

export default function LocatariosDisplay() {
  const [locatarios, setLocatarios] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocatarios = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/persons?tipo=locatario")

      if (!response.ok) {
        throw new Error(`Error al obtener locatarios: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setLocatarios(data.persons || [])
      } else {
        setError(data.message || "Error desconocido al obtener locatarios")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocatarios()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Locatarios</CardTitle>
          <CardDescription>Lista de locatarios importados</CardDescription>
        </div>
        <div className="flex gap-2">
          <ExportButton
            endpoint="/export/locatarios"
            label="Exportar CSV"
            filename={`locatarios_${new Date().toISOString().split("T")[0]}.csv`}
          />
          <Button variant="outline" size="icon" onClick={fetchLocatarios} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Error: {error}</p>
          </div>
        ) : locatarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? "Cargando locatarios..." : "No hay locatarios importados"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>CUIT</TableHead>
                <TableHead>Fecha de creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locatarios.map((locatario) => (
                <TableRow key={locatario.id}>
                  <TableCell>{locatario.nombre}</TableCell>
                  <TableCell>{locatario.cuit}</TableCell>
                  <TableCell>
                    {locatario.created_at ? new Date(locatario.created_at).toLocaleString("es-AR") : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
