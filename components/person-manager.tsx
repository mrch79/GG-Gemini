"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Person } from "@/lib/storage-service.server"
import { Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PersonManager() {
  const [persons, setPersons] = useState<Person[]>([])
  const [activeType, setActiveType] = useState<"locador" | "locatario">("locador")
  const [newPerson, setNewPerson] = useState<{
    nombre: string
    cuit: string
    tipo: "locador" | "locatario"
  }>({
    nombre: "",
    cuit: "",
    tipo: "locador",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadPersons()
  }, [activeType])

  const loadPersons = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/persons?tipo=${activeType}`)
      const data = await response.json()

      if (data.success) {
        setPersons(data.persons)
      } else {
        console.error("Error loading persons:", data.error)
      }
    } catch (error) {
      console.error("Error loading persons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPerson((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: "locador" | "locatario") => {
    setActiveType(value)
    setNewPerson((prev) => ({ ...prev, tipo: value }))
    // Limpiar mensajes al cambiar de tipo
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      })

      const data = await response.json()

      if (data.success) {
        setPersons((prev) => [data.person, ...prev])
        setNewPerson({
          nombre: "",
          cuit: "",
          tipo: activeType,
        })
        setSuccess(`${activeType === "locador" ? "Locador" : "Locatario"} guardado correctamente`)
      } else {
        console.error("Error saving person:", data.error)
        setError(data.error || `Error al guardar ${activeType === "locador" ? "locador" : "locatario"}`)
      }
    } catch (error) {
      console.error("Error saving person:", error)
      setError(`Error al guardar ${activeType === "locador" ? "locador" : "locatario"}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/persons/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setPersons((prev) => prev.filter((p) => p.id !== id))
        setSuccess(`${activeType === "locador" ? "Locador" : "Locatario"} eliminado correctamente`)
      } else {
        console.error("Error deleting person:", data.error)
        setError(`Error al eliminar ${activeType === "locador" ? "locador" : "locatario"}`)
      }
    } catch (error) {
      console.error("Error deleting person:", error)
      setError(`Error al eliminar ${activeType === "locador" ? "locador" : "locatario"}`)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Personas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={activeType} onValueChange={(value) => handleTypeChange(value as "locador" | "locatario")}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="locador">Locadores</SelectItem>
              <SelectItem value="locatario">Locatarios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input name="nombre" value={newPerson.nombre} onChange={handleInputChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CUIT</label>
            <Input name="cuit" value={newPerson.cuit} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Guardando..." : `Guardar ${activeType === "locador" ? "Locador" : "Locatario"}`}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="font-medium mb-2">{activeType === "locador" ? "Locadores" : "Locatarios"} Guardados</h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Cargando...</p>
          ) : persons.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay {activeType === "locador" ? "locadores" : "locatarios"} guardados
            </p>
          ) : (
            <div className="space-y-2">
              {persons.map((person) => (
                <div key={person.id} className="border p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{person.nombre}</p>
                    <p className="text-sm text-gray-600">CUIT: {person.cuit}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(person.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={deleting === person.id}
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
