"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type HeaderConfig, getDefaultHeaderConfig } from "@/lib/header-config-service.server"
import LogoUpload from "./logo-upload"
import { useToast } from "@/hooks/use-toast"

export default function HeaderConfigManager() {
  const [config, setConfig] = useState<HeaderConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        console.log("Loading header config...")

        // Usar la API para evitar problemas de caché
        const response = await fetch(`/api/header-config?t=${Date.now()}`)
        const data = await response.json()

        if (data.success && data.config) {
          console.log("Loaded config from API:", data.config)
          setConfig(data.config)
        } else {
          throw new Error("Failed to load config from API")
        }
      } catch (error) {
        console.error("Error loading header config:", error)
        // If there's an error, load the default config
        const defaultConfig = await getDefaultHeaderConfig()
        setConfig(defaultConfig)
        toast({
          title: "Error al cargar la configuración",
          description: "Se ha cargado la configuración por defecto.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleLogoChange = (logoBase64: string) => {
    setConfig((prev) => (prev ? { ...prev, logo: logoBase64 } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!config) return

    setSaving(true)
    try {
      console.log("Saving config:", config)

      const response = await fetch("/api/header-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Configuración guardada",
          description: "La configuración del encabezado se ha guardado correctamente.",
        })

        // Recargar la configuración para verificar que se guardó correctamente
        const refreshResponse = await fetch(`/api/header-config?t=${Date.now()}`)
        const refreshData = await refreshResponse.json()

        if (refreshData.success && refreshData.config) {
          console.log("Refreshed config after save:", refreshData.config)
          setConfig(refreshData.config)
        }
      } else {
        throw new Error(result.error || "Error al guardar la configuración")
      }
    } catch (error) {
      console.error("Error saving header config:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración del encabezado.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    const defaultConfig = await getDefaultHeaderConfig()
    setConfig(defaultConfig)
  }

  if (loading || !config) {
    return <div className="text-center p-4">Cargando configuración...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Encabezado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Negocio</label>
                <Input name="businessName" value={config.businessName} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Propietario</label>
                <Input name="ownerName" value={config.ownerName} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Información de Licencia</label>
              <Input name="licenseInfo" value={config.licenseInfo} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ubicación</label>
                <Input name="location" value={config.location} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <Input name="phone" value={config.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CUIT</label>
                <Input name="taxId" value={config.taxId} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ingresos Brutos</label>
                <Input name="taxIdBrutos" value={config.taxIdBrutos} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                <Input name="startDate" value={config.startDate} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado Fiscal</label>
                <Input name="taxStatus" value={config.taxStatus} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Configuración"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
                Restablecer Valores
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <LogoUpload currentLogo={config.logo} onLogoChange={handleLogoChange} />
    </div>
  )
}
