"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function CSVTemplates() {
  const downloadTemplate = (type: "properties" | "locadores" | "locatarios") => {
    let csvContent = ""

    switch (type) {
      case "properties":
        csvContent =
          "propiedad,tipo,direccion,localidad\nEdificio Central,Departamento,Av. Corrientes 1234 5B,CABA\nCasa Palermo,Casa,Thames 1234,CABA"
        break
      case "locadores":
      case "locatarios":
        csvContent = "nombre,cuit\nJuan Pérez,20-12345678-9\nMaría González,27-98765432-1"
        break
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `template-${type}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plantillas CSV</CardTitle>
        <CardDescription>Descarga plantillas de ejemplo para cada tipo de datos</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Propiedades</h3>
            <p className="text-sm text-muted-foreground">Plantilla para importar propiedades</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => downloadTemplate("properties")}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Locadores</h3>
            <p className="text-sm text-muted-foreground">Plantilla para importar locadores</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => downloadTemplate("locadores")}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Locatarios</h3>
            <p className="text-sm text-muted-foreground">Plantilla para importar locatarios</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => downloadTemplate("locatarios")}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
