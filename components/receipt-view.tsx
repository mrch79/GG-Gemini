"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ReceiptHeader from "./receipt-header"
import type { Receipt } from "@/lib/storage-service.server"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Printer, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReceiptViewProps {
  id: string
}

// Función de respaldo para formatear fechas en caso de que la importación falle
function formatDateFallback(dateString: string): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Formatear como DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    return dateString
  }
}

export default function ReceiptView({ id }: ReceiptViewProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`ReceiptView: Cargando recibo con ID: ${id}`)

        // Usar la nueva API con parámetros de consulta en lugar de parámetros de ruta
        const response = await fetch(`/api/receipt-by-id?id=${id}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`ReceiptView: Error en respuesta: ${response.status}, ${errorText}`)
          throw new Error(`Error al cargar el recibo: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log(`ReceiptView: Datos recibidos:`, data)

        if (!data.success || !data.receipt) {
          throw new Error(data.error || "Recibo no encontrado")
        }

        // Normalizar los datos del recibo
        const normalizedReceipt = { ...data.receipt }

        // Si hay un campo otros-gastos, copiarlo a otrosGastos
        if (normalizedReceipt["otros-gastos"] && !normalizedReceipt.otrosGastos) {
          normalizedReceipt.otrosGastos = normalizedReceipt["otros-gastos"]
        }

        console.log("ReceiptView: Recibo normalizado:", normalizedReceipt)
        setReceipt(normalizedReceipt)
      } catch (error) {
        console.error("ReceiptView: Error al cargar recibo:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el recibo")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadReceipt()
    } else {
      setError("ID de recibo no proporcionado")
      setLoading(false)
    }
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  // Función para formatear la fecha con manejo de errores
  const formatDateSafe = (dateString: string): string => {
    try {
      // Intentar usar la función importada
      if (typeof formatDate === "function") {
        return formatDate(dateString)
      }
      // Si no está disponible, usar la función de respaldo
      return formatDateFallback(dateString)
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString || ""
    }
  }

  // Calculate total
  const calculateTotal = () => {
    if (!receipt) return "0.00"

    try {
      // Manejar tanto otrosGastos como otros-gastos
      const otrosGastosValue = receipt.otrosGastos || receipt["otros-gastos"] || "0"

      const values = [
        Number.parseFloat(receipt.alquiler || "0"),
        Number.parseFloat(receipt.aysa || "0"),
        Number.parseFloat(receipt.edesur || "0"),
        Number.parseFloat(receipt.municipal || "0"),
        Number.parseFloat(receipt.iibb || "0"),
        Number.parseFloat(otrosGastosValue),
      ]

      return values.reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0).toFixed(2)
    } catch (error) {
      console.error("Error calculating total:", error, receipt)
      return "0.00"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-lg">Cargando recibo...</p>
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error || "Recibo no encontrado"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/historial">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al historial
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-between print:hidden">
        <Button asChild variant="outline">
          <Link href="/historial">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al historial
          </Link>
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir Recibo
        </Button>
      </div>

      <Card className="p-6 border-2 shadow-md print:shadow-none print:border-0 print:p-2" id="receipt-to-print">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #receipt-to-print {
              width: 100%;
              max-width: 100%;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .print-compact {
              margin: 0 !important;
              padding: 0.25rem !important;
            }
            .print-compact-table {
              font-size: 0.75rem !important;
            }
            .print-compact-table th,
            .print-compact-table td {
              padding: 0.25rem !important;
            }
            .print-small-text {
              font-size: 0.75rem !important;
            }
            .print-smaller-text {
              font-size: 0.7rem !important;
            }
            .print-compact-grid {
              gap: 0.25rem !important;
              margin-bottom: 0.25rem !important;
            }
            .print-compact-border {
              padding: 0.25rem !important;
            }
            .print-signature {
              margin-top: 0.5rem !important;
            }
            .print-mb-1 {
              margin-bottom: 0.25rem !important;
            }
            .print-mb-2 {
              margin-bottom: 0.5rem !important;
            }
            .print-mb-3 {
              margin-bottom: 0.75rem !important;
            }
          }
        `}</style>

        <div className="print-compact">
          <ReceiptHeader />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 print:print-compact-grid">
          <div className="border p-2 print:print-compact-border">
            <div className="flex justify-between">
              <span className="font-bold">Fecha:</span>
              <span>{formatDateSafe(receipt.fecha || "")}</span>
            </div>
          </div>
          <div className="border p-2 print:print-compact-border">
            <div className="flex justify-between">
              <span className="font-bold">Período:</span>
              <span>{receipt.periodo}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 print:print-compact-grid">
          <div className="border p-2 print:print-compact-border">
            <div className="flex justify-between">
              <span className="font-bold">Nº Propiedad:</span>
              <span>{receipt.propiedad}</span>
            </div>
          </div>
          <div className="border p-2 print:print-compact-border">
            <div className="flex justify-between">
              <span className="font-bold">Tipo:</span>
              <span>{receipt.tipo}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 print:print-compact-grid">
          <div className="border p-2 print:print-compact-border">
            <div className="print:print-small-text">
              <span className="font-bold">Locador:</span> {receipt.locador}
            </div>
            <div className="print:print-small-text">
              <span className="font-bold">CUIT:</span> {receipt.locadorCuit}
            </div>
          </div>
          <div className="border p-2 print:print-compact-border">
            <div className="print:print-small-text">
              <span className="font-bold">Locatario:</span> {receipt.locatario}
            </div>
            <div className="print:print-small-text">
              <span className="font-bold">CUIT:</span> {receipt.locatarioCuit}
            </div>
          </div>
        </div>

        <div className="mb-4 print:print-mb-2">
          <div className="border p-2 print:print-compact-border">
            <div className="print:print-small-text">
              <span className="font-bold">Dirección:</span> {receipt.direccion}
            </div>
            <div className="print:print-small-text">
              <span className="font-bold">Localidad:</span> {receipt.localidad}
            </div>
          </div>
        </div>

        <div className="mb-2 print:print-mb-1">
          <p className="text-sm md:text-base print:print-small-text">
            Por mandato del Locador, recibí del Locatario, la suma de los conceptos a continuación:
          </p>
        </div>

        <div className="mb-4 print:print-mb-2 overflow-x-auto">
          <table className="w-full border-collapse print:print-compact-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left print:print-compact-border">Código</th>
                <th className="border p-2 text-left print:print-compact-border">Conceptos</th>
                <th className="border p-2 text-left print:print-compact-border">Período</th>
                <th className="border p-2 text-right print:print-compact-border">Importe</th>
              </tr>
            </thead>
            <tbody>
              {receipt.alquiler && Number.parseFloat(receipt.alquiler) > 0 && (
                <tr>
                  <td className="border p-2 print:print-compact-border">1</td>
                  <td className="border p-2 print:print-compact-border">Alquiler</td>
                  <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                  <td className="border p-2 text-right print:print-compact-border">
                    $ {Number.parseFloat(receipt.alquiler).toFixed(2)}
                  </td>
                </tr>
              )}
              {receipt.aysa && Number.parseFloat(receipt.aysa) > 0 && (
                <tr>
                  <td className="border p-2 print:print-compact-border">2</td>
                  <td className="border p-2 print:print-compact-border">AySA</td>
                  <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                  <td className="border p-2 text-right print:print-compact-border">
                    $ {Number.parseFloat(receipt.aysa).toFixed(2)}
                  </td>
                </tr>
              )}
              {receipt.edesur && Number.parseFloat(receipt.edesur) > 0 && (
                <tr>
                  <td className="border p-2 print:print-compact-border">3</td>
                  <td className="border p-2 print:print-compact-border">Edesur</td>
                  <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                  <td className="border p-2 text-right print:print-compact-border">
                    $ {Number.parseFloat(receipt.edesur).toFixed(2)}
                  </td>
                </tr>
              )}
              {receipt.municipal && Number.parseFloat(receipt.municipal) > 0 && (
                <tr>
                  <td className="border p-2 print:print-compact-border">4</td>
                  <td className="border p-2 print:print-compact-border">Municipal</td>
                  <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                  <td className="border p-2 text-right print:print-compact-border">
                    $ {Number.parseFloat(receipt.municipal).toFixed(2)}
                  </td>
                </tr>
              )}
              {receipt.iibb && Number.parseFloat(receipt.iibb) > 0 && (
                <tr>
                  <td className="border p-2 print:print-compact-border">5</td>
                  <td className="border p-2 print:print-compact-border">IIBB</td>
                  <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                  <td className="border p-2 text-right print:print-compact-border">
                    $ {Number.parseFloat(receipt.iibb).toFixed(2)}
                  </td>
                </tr>
              )}
              {(receipt.otrosGastos || receipt["otros-gastos"]) &&
                Number.parseFloat(receipt.otrosGastos || receipt["otros-gastos"] || "0") > 0 && (
                  <tr>
                    <td className="border p-2 print:print-compact-border">6</td>
                    <td className="border p-2 print:print-compact-border">Otros Gastos</td>
                    <td className="border p-2 print:print-compact-border">{receipt.periodo}</td>
                    <td className="border p-2 text-right print:print-compact-border">
                      $ {Number.parseFloat(receipt.otrosGastos || receipt["otros-gastos"] || "0").toFixed(2)}
                    </td>
                  </tr>
                )}
              <tr className="bg-gray-50 font-bold">
                <td className="border p-2 print:print-compact-border" colSpan={3}>
                  TOTAL
                </td>
                <td className="border p-2 text-right print:print-compact-border">$ {calculateTotal()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {receipt.observaciones && (
          <div className="mb-4 print:print-mb-2">
            <div className="border p-2 print:print-compact-border">
              <span className="font-bold print:print-small-text">Observaciones:</span>{" "}
              <span className="print:print-small-text">{receipt.observaciones}</span>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-8 print:print-signature print:gap-4">
          <div className="text-center">
            <div className="border-t border-black pt-2 print:print-smaller-text">Firma del Locador</div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2 print:print-smaller-text">Firma del Locatario</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
