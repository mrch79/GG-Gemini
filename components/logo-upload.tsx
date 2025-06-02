"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface LogoUploadProps {
  currentLogo?: string
  onLogoChange: (logoBase64: string) => void
}

export default function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentLogo)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert("El archivo es demasiado grande. El tamaño máximo es 1MB.")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccione un archivo de imagen válido.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setPreviewUrl(base64)
      onLogoChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setPreviewUrl(undefined)
    onLogoChange(null as any) // Usar null en lugar de cadena vacía
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo del Recibo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {previewUrl ? (
            <div className="flex flex-col items-center">
              <div className="border p-4 rounded-md mb-2 bg-white">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Logo preview"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <Button variant="destructive" onClick={handleRemoveLogo}>
                Eliminar Logo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-md mb-2 flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-2">No hay logo cargado</p>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    Seleccionar Imagen
                  </Button>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="mt-4">
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" type="button" onClick={() => document.getElementById("logo-upload")?.click()}>
                  Cambiar Imagen
                </Button>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-2">
            <p>Formatos aceptados: JPG, PNG, GIF</p>
            <p>Tamaño máximo: 1MB</p>
            <p>Tamaño recomendado: 150x150px</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
