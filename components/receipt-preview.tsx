"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRef } from "react"
import ReceiptHeader from "./receipt-header"

interface ReceiptPreviewProps {
  data: {
    fecha: string
    propiedad: string
    periodo: string
    locador: string
    locadorCuit: string
    locatario: string
    locatarioCuit: string
    tipo: string
    direccion: string
    localidad: string
    alquiler: string
    aysa: string
    edesur: string
    municipal: string
    iibb: string
    otrosGastos: string
    observaciones: string
  }
}

export default function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  // Función simple para imprimir usando la API nativa del navegador
  const handlePrint = () => {
    window.print()
  }

  // Calculate total
  const calculateTotal = () => {
    const values = [
      Number.parseFloat(data.alquiler || "0"),
      Number.parseFloat(data.aysa || "0"),
      Number.parseFloat(data.edesur || "0"),
      Number.parseFloat(data.municipal || "0"),
      Number.parseFloat(data.iibb || "0"),
      Number.parseFloat(data.otrosGastos || "0"),
    ]

    return values.reduce((acc, val) => acc + val, 0).toFixed(2)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR")
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handlePrint}>Imprimir Recibo</Button>
      </div>

      <Card className="p-6 border-2" id="receipt-to-print" ref={componentRef}>
        {/* Nuevo encabezado personalizado */}
        <ReceiptHeader />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border p-2">
            <div className="flex justify-between">
              <span className="font-bold">Fecha:</span>
              <span>{formatDate(data.fecha)}</span>
            </div>
          </div>
          <div className="border p-2">
            <div className="flex justify-between">
              <span className="font-bold">Período:</span>
              <span>{data.periodo}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border p-2">
            <div className="flex justify-between">
              <span className="font-bold">Nº Propiedad:</span>
              <span>{data.propiedad}</span>
            </div>
          </div>
          <div className="border p-2">
            <div className="flex justify-between">
              <span className="font-bold">Tipo:</span>
              <span>{data.tipo}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border p-2">
            <div>
              <span className="font-bold">Locador:</span> {data.locador}
            </div>
            <div>
              <span className="font-bold">CUIT:</span> {data.locadorCuit}
            </div>
          </div>
          <div className="border p-2">
            <div>
              <span className="font-bold">Locatario:</span> {data.locatario}
            </div>
            <div>
              <span className="font-bold">CUIT:</span> {data.locatarioCuit}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="border p-2">
            <div>
              <span className="font-bold">Dirección:</span> {data.direccion}
            </div>
            <div>
              <span className="font-bold">Localidad:</span> {data.localidad}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p>Por mandato del Locador, recibí del Locatario, la suma de los conceptos a continuación:</p>
        </div>

        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Código</th>
                <th className="border p-2 text-left">Conceptos</th>
                <th className="border p-2 text-left">Período</th>
                <th className="border p-2 text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {data.alquiler && (
                <tr>
                  <td className="border p-2">1</td>
                  <td className="border p-2">Alquiler</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.alquiler).toFixed(2)}</td>
                </tr>
              )}
              {data.aysa && (
                <tr>
                  <td className="border p-2">2</td>
                  <td className="border p-2">AySA</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.aysa).toFixed(2)}</td>
                </tr>
              )}
              {data.edesur && (
                <tr>
                  <td className="border p-2">3</td>
                  <td className="border p-2">Edesur</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.edesur).toFixed(2)}</td>
                </tr>
              )}
              {data.municipal && (
                <tr>
                  <td className="border p-2">4</td>
                  <td className="border p-2">Municipal</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.municipal).toFixed(2)}</td>
                </tr>
              )}
              {data.iibb && (
                <tr>
                  <td className="border p-2">5</td>
                  <td className="border p-2">IIBB</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.iibb).toFixed(2)}</td>
                </tr>
              )}
              {data.otrosGastos && (
                <tr>
                  <td className="border p-2">6</td>
                  <td className="border p-2">Otros Gastos</td>
                  <td className="border p-2">{data.periodo}</td>
                  <td className="border p-2 text-right">$ {Number.parseFloat(data.otrosGastos).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data.observaciones && (
          <div className="mb-4">
            <div className="border p-2">
              <span className="font-bold">Observaciones:</span> {data.observaciones}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="font-bold">Son Pesos:</span>
          </div>
          <div>
            <span className="font-bold">TOTAL:</span> $ {calculateTotal()}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-t border-black pt-2">Firma del Locador</div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">Firma del Locatario</div>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Volver al formulario
        </Button>
      </div>
    </div>
  )
}
