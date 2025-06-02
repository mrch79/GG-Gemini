"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw, Printer } from "lucide-react"
import ExportButton from "./export-button"
import Link from "next/link"

interface Property {
  id: string
  propiedad: string
  tipo: string
  direccion: string
  localidad: string
  created_at?: string
}

export default function PropertyDisplay() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/properties")

      if (!response.ok) {
        throw new Error(`Error al obtener propiedades: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProperties(data.properties || [])
      } else {
        setError(data.message || "Error desconocido al obtener propiedades")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Propiedades</CardTitle>
          <CardDescription>Lista de propiedades importadas</CardDescription>
        </div>
        <div className="flex gap-2">
          <Link href="/print/properties" passHref>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Vista de impresión
            </Button>
          </Link>
          <ExportButton
            endpoint="/export/properties"
            label="Exportar CSV"
            filename={`propiedades_${new Date().toISOString().split("T")[0]}.csv`}
          />
          <Button variant="outline" size="icon" onClick={fetchProperties} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Error: {error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? "Cargando propiedades..." : "No hay propiedades importadas"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Fecha de creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.propiedad}</TableCell>
                  <TableCell>{property.tipo}</TableCell>
                  <TableCell>{property.direccion}</TableCell>
                  <TableCell>{property.localidad}</TableCell>
                  <TableCell>
                    {property.created_at ? new Date(property.created_at).toLocaleString("es-AR") : "N/A"}
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
