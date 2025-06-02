"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Plus, Home, X, Trash2, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Property {
  id: string
  propiedad: string
  tipo: string
  direccion: string
  localidad: string
}

interface PropertyListProps {
  onAddNew: () => void
}

export default function PropertyList({ onAddNew }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [searchTerm, properties])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/properties")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al cargar las propiedades")
      }

      setProperties(Array.isArray(data.properties) ? data.properties : [])
    } catch (error) {
      console.error("Error loading properties:", error)
      setError(error instanceof Error ? error.message : "Error al cargar las propiedades")
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties)
      return
    }

    const term = searchTerm.toLowerCase().trim()
    const filtered = properties.filter(
      (property) =>
        property.propiedad.toLowerCase().includes(term) ||
        property.tipo.toLowerCase().includes(term) ||
        property.direccion.toLowerCase().includes(term) ||
        property.localidad.toLowerCase().includes(term),
    )
    setFilteredProperties(filtered)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro que desea eliminar esta propiedad?")) {
      return
    }

    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al eliminar la propiedad")
      }

      toast({
        title: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada correctamente",
      })

      // Actualizar la lista
      setProperties(properties.filter((property) => property.id !== id))
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar la propiedad",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Input placeholder="Buscar propiedades..." value={searchTerm} onChange={handleSearch} className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Propiedad
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando propiedades...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <p className="text-lg mb-4">No se encontraron propiedades</p>
          {searchTerm && (
            <Button variant="outline" onClick={clearSearch} className="mr-2">
              Limpiar búsqueda
            </Button>
          )}
          <Button onClick={onAddNew}>Agregar Propiedad</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span className="truncate">{property.propiedad}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      title="Eliminar"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start mb-2">
                  <Home className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">{property.tipo}</p>
                    <p className="text-sm text-gray-600">{property.direccion}</p>
                    <p className="text-sm text-gray-600">{property.localidad}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
