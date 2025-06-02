"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Plus, User, X, Trash2, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Person {
  id: string
  nombre: string
  cuit: string
  tipo: string
}

interface PersonListProps {
  onAddLocador: () => void
  onAddLocatario: () => void
}

export default function PersonList({ onAddLocador, onAddLocatario }: PersonListProps) {
  const [persons, setPersons] = useState<Person[]>([])
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "locador" | "locatario">("all")

  useEffect(() => {
    loadPersons()
  }, [])

  useEffect(() => {
    filterPersons()
  }, [searchTerm, persons, activeTab])

  const loadPersons = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/persons")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al cargar las personas")
      }

      setPersons(Array.isArray(data.persons) ? data.persons : [])
    } catch (error) {
      console.error("Error loading persons:", error)
      setError(error instanceof Error ? error.message : "Error al cargar las personas")
    } finally {
      setLoading(false)
    }
  }

  const filterPersons = () => {
    let filtered = [...persons]

    // Filtrar por tipo
    if (activeTab !== "all") {
      filtered = filtered.filter((person) => person.tipo === activeTab)
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (person) => person.nombre.toLowerCase().includes(term) || person.cuit.toLowerCase().includes(term),
      )
    }

    setFilteredPersons(filtered)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro que desea eliminar esta persona?")) {
      return
    }

    try {
      const response = await fetch(`/api/persons?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al eliminar la persona")
      }

      toast({
        title: "Persona eliminada",
        description: "La persona ha sido eliminada correctamente",
      })

      // Actualizar la lista
      setPersons(persons.filter((person) => person.id !== id))
    } catch (error) {
      console.error("Error deleting person:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar la persona",
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Input placeholder="Buscar personas..." value={searchTerm} onChange={handleSearch} className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={onAddLocador}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Locador
          </Button>
          <Button onClick={onAddLocatario}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Locatario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="locador">Locadores</TabsTrigger>
          <TabsTrigger value="locatario">Locatarios</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-center p-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando personas...</p>
        </div>
      ) : filteredPersons.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <p className="text-lg mb-4">No se encontraron personas</p>
          {searchTerm && (
            <Button variant="outline" onClick={clearSearch} className="mr-2">
              Limpiar búsqueda
            </Button>
          )}
          <div className="flex justify-center gap-2 mt-4">
            <Button onClick={onAddLocador}>Agregar Locador</Button>
            <Button onClick={onAddLocatario}>Agregar Locatario</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((person) => (
            <Card key={person.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span className="truncate">{person.nombre}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      title="Eliminar"
                      onClick={() => handleDelete(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start mb-2">
                  <User className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">CUIT: {person.cuit}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      Tipo: {person.tipo === "locador" ? "Locador" : "Locatario"}
                    </p>
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
