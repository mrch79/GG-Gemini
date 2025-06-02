"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Property } from "@/lib/storage-service"
import { Trash2 } from "lucide-react"

export default function PropertyManager() {
  const [properties, setProperties] = useState<Property[]>([])
  const [newProperty, setNewProperty] = useState({
    propiedad: "",
    tipo: "",
    direccion: "",
    localidad: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/properties")
      const data = await response.json()

      if (data.success) {
        setProperties(data.properties)
      } else {
        console.error("Error loading properties:", data.error)
      }
    } catch (error) {
      console.error("Error loading properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProperty((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProperty),
      })

      const data = await response.json()

      if (data.success) {
        setProperties((prev) => [data.property, ...prev])
        setNewProperty({
          propiedad: "",
          tipo: "",
          direccion: "",
          localidad: "",
        })
      } else {
        console.error("Error saving property:", data.error)
        alert("Error al guardar la propiedad")
      }
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error al guardar la propiedad")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id))
      } else {
        console.error("Error deleting property:", data.error)
        alert("Error al eliminar la propiedad")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Error al eliminar la propiedad")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Propiedades</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nº Propiedad</label>
              <Input name="propiedad" value={newProperty.propiedad} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Input name="tipo" value={newProperty.tipo} onChange={handleInputChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <Input name="direccion" value={newProperty.direccion} onChange={handleInputChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Localidad</label>
            <Input name="localidad" value={newProperty.localidad} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Propiedad"}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Propiedades Guardadas</h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Cargando propiedades...</p>
          ) : properties.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay propiedades guardadas</p>
          ) : (
            <div className="space-y-2">
              {properties.map((property) => (
                <div key={property.id} className="border p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {property.propiedad} - {property.tipo}
                    </p>
                    <p className="text-sm text-gray-600">
                      {property.direccion}, {property.localidad}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={deleting === property.id}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
