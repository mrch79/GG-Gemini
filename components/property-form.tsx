"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PropertyFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PropertyForm({ onSuccess, onCancel }: PropertyFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    propiedad: "",
    tipo: "",
    direccion: "",
    localidad: "",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.propiedad.trim()) {
      newErrors.propiedad = "El nombre de la propiedad es requerido"
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = "El tipo de propiedad es requerido"
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }

    if (!formData.localidad.trim()) {
      newErrors.localidad = "La localidad es requerida"
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
      const response = await fetch("/api/properties", {
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
          title: "Propiedad agregada",
          description: `${formData.propiedad} ha sido agregada correctamente`,
        })
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error al guardar propiedad:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar propiedad",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Agregar Nueva Propiedad</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="propiedad" className={errors.propiedad ? "text-destructive" : ""}>
              Nombre de la Propiedad {errors.propiedad && <span className="text-xs">- {errors.propiedad}</span>}
            </Label>
            <Input
              id="propiedad"
              name="propiedad"
              value={formData.propiedad}
              onChange={handleInputChange}
              placeholder="Ej: Propiedad 1"
              className={errors.propiedad ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label htmlFor="tipo" className={errors.tipo ? "text-destructive" : ""}>
              Tipo de Propiedad {errors.tipo && <span className="text-xs">- {errors.tipo}</span>}
            </Label>
            <Input
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              placeholder="Ej: Departamento, Local Comercial, Casa"
              className={errors.tipo ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label htmlFor="direccion" className={errors.direccion ? "text-destructive" : ""}>
              Dirección {errors.direccion && <span className="text-xs">- {errors.direccion}</span>}
            </Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Ej: Av. Corrientes 1234"
              className={errors.direccion ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label htmlFor="localidad" className={errors.localidad ? "text-destructive" : ""}>
              Localidad {errors.localidad && <span className="text-xs">- {errors.localidad}</span>}
            </Label>
            <Input
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              placeholder="Ej: CABA, Rosario"
              className={errors.localidad ? "border-destructive" : ""}
            />
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
