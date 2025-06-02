"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, Upload, X, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { HeaderConfig } from "@/lib/header-config-service.server"

export default function HeaderConfigForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<HeaderConfig>({
    businessName: "",
    ownerName: "",
    licenseInfo: "",
    location: "",
    phone: "",
    taxId: "",
    taxIdBrutos: "",
    startDate: "",
    taxStatus: "",
    logo: null,
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchHeaderConfig = async () => {
      try {
        setLoadingData(true)
        setError(null)

        const response = await fetch("/api/header-config")

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.config) {
          console.log("Header config loaded:", data.config)
          setFormData(data.config)

          // Si hay un logo, establecer la vista previa
          if (data.config.logo) {
            setLogoPreview(data.config.logo)
          }
        } else {
          console.warn("No header config found or error:", data.error || "Unknown error")
          // Mantener los valores predeterminados
        }
      } catch (error) {
        console.error("Error fetching header config:", error)
        setError(error instanceof Error ? error.message : "Error desconocido")
      } finally {
        setLoadingData(false)
      }
    }

    fetchHeaderConfig()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "El archivo debe ser una imagen (JPG, PNG, GIF)",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 2MB",
        variant: "destructive",
      })
      return
    }

    // Crear URL para vista previa
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogoPreview(result)

      // Guardar la imagen como base64 en el formData
      setFormData({
        ...formData,
        logo: result,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setFormData({
      ...formData,
      logo: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/header-config", {
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
          title: "Configuración guardada",
          description: "La configuración del encabezado ha sido guardada correctamente",
        })
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error saving header config:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      toast({
        title: "Error",
        description:
          "Error al guardar la configuración: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="text-center p-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuración del Encabezado del Recibo</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Ej: G&G ADMINISTRACIÓN"
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Nombre del Propietario</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Ej: de Gilda Faria"
              />
            </div>

            <div>
              <Label htmlFor="licenseInfo">Información de Licencia</Label>
              <Input
                id="licenseInfo"
                name="licenseInfo"
                value={formData.licenseInfo}
                onChange={handleInputChange}
                placeholder="Ej: L.N. Agente de Cobro (1842)"
              />
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Provincia de Buenos Aires"
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ej: Tel: 5317-4164"
              />
            </div>

            <div>
              <Label htmlFor="taxId">CUIT</Label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Ej: 27-30888523-8"
              />
            </div>

            <div>
              <Label htmlFor="taxIdBrutos">Ingresos Brutos</Label>
              <Input
                id="taxIdBrutos"
                name="taxIdBrutos"
                value={formData.taxIdBrutos}
                onChange={handleInputChange}
                placeholder="Ej: 27-30888523-8"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Fecha de Inicio de Actividades</Label>
              <Input
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="Ej: 11/2015"
              />
            </div>

            <div>
              <Label htmlFor="taxStatus">Estado Fiscal</Label>
              <Input
                id="taxStatus"
                name="taxStatus"
                value={formData.taxStatus}
                onChange={handleInputChange}
                placeholder="Ej: RESPONSABLE MONOTRIBUTO"
              />
            </div>

            {/* Campo para subir el logo */}
            <div className="col-span-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="mt-2 flex flex-col space-y-4">
                {/* Área de vista previa */}
                <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="max-h-32 max-w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Sube un logo para tu empresa (formato JPG, PNG o GIF, máx. 2MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Botón para seleccionar archivo */}
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    id="logo"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    {logoPreview ? "Cambiar logo" : "Subir logo"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              "Guardar Configuración"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
