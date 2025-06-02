"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PersonFormProps {
  defaultType?: "locador" | "locatario"
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PersonForm({ defaultType = "locador", onSuccess, onCancel }: PersonFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    tipo: defaultType,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Limpiar error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      tipo: value as "locador" | "locatario",
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.cuit.trim()) {
      newErrors.cuit = "El CUIT es requerido"
    } else if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.cuit)) {
      newErrors.cuit = "El formato debe ser XX-XXXXXXXX-X"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Persona agregada",
          description: `${formData.nombre} ha sido agregado como ${
            formData.tipo === "locador" ? "locador" : "locatario"
          }`,
        })
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error al guardar persona:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar persona",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{formData.tipo === "locador" ? "Agregar Nuevo Locador" : "Agregar Nuevo Locatario"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nombre" className={errors.nombre ? "text-destructive" : ""}>
              Nombre Completo {errors.nombre && <span className="text-xs">- {errors.nombre}</span>}
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className={errors.nombre ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label htmlFor="cuit" className={errors.cuit ? "text-destructive" : ""}>
              CUIT {errors.cuit && <span className="text-xs">- {errors.cuit}</span>}
            </Label>
            <Input
              id="cuit"
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              placeholder="XX-XXXXXXXX-X"
              className={errors.cuit ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={handleTypeChange}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="locador">Locador</SelectItem>
                <SelectItem value="locatario">Locatario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
