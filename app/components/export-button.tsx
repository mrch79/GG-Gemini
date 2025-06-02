"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps {
  endpoint: string
  label: string
  filename: string
}

export default function ExportButton({ endpoint, label, filename }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Realizar la solicitud al endpoint de exportación
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error al exportar datos: ${response.status}`)
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob()

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear un elemento de enlace para descargar el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error al exportar:", error)
      alert(`Error al exportar: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exportando..." : label}
    </Button>
  )
}
