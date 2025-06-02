"use client"

import { useEffect, useState } from "react"
import PrintView from "./print-view"

interface Property {
  id: string
  propiedad: string
  tipo: string
  direccion: string
  localidad: string
  created_at?: string
}

export default function PropertyPrintView() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
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

    fetchProperties()
  }, [])

  if (loading) {
    return <div>Cargando propiedades...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <PrintView title="Listado de Propiedades">
      <div className="print-optimized">
        <h1 className="text-center text-xl font-bold mb-4">Listado de Propiedades</h1>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Propiedad</th>
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Dirección</th>
              <th className="border p-2 text-left">Localidad</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b">
                <td className="border p-2">{property.propiedad}</td>
                <td className="border p-2">{property.tipo}</td>
                <td className="border p-2">{property.direccion}</td>
                <td className="border p-2">{property.localidad}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center text-sm mt-4">
          <p>Total de propiedades: {properties.length}</p>
          <p className="text-gray-500">Fecha de impresión: {new Date().toLocaleDateString("es-AR")}</p>
        </div>
      </div>
    </PrintView>
  )
}
