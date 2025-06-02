"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReceiptHeader() {
  const [headerConfig, setHeaderConfig] = useState({
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHeaderConfig = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/header-config")

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.config) {
          console.log("Header config loaded:", data.config)
          setHeaderConfig(data.config)
        } else {
          console.warn("No header config found or error:", data.error || "Unknown error")
          // Establecer valores predeterminados
          setHeaderConfig({
            businessName: "G&G ADMINISTRACIÓN",
            ownerName: "de Gilda Faria",
            licenseInfo: "L.N. Agente de Cobro (1842)",
            location: "Provincia de Buenos Aires",
            phone: "Tel: 5317-4164",
            taxId: "27-30888523-8",
            taxIdBrutos: "27-30888523-8",
            startDate: "11/2015",
            taxStatus: "RESPONSABLE MONOTRIBUTO",
            logo: null,
          })
        }
      } catch (error) {
        console.error("Error fetching header config:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHeaderConfig()
  }, [])

  if (loading) {
    return (
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-16 w-48" />
        </div>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b-2 border-gray-800 pb-2 mb-6">
        <div className="text-center text-red-500 py-2">
          Error al cargar el encabezado. Usando valores predeterminados.
        </div>
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="border-2 border-black w-8 h-8 flex items-center justify-center font-bold mr-2">X</div>
              <div className="text-xl font-bold">RECIBO</div>
            </div>
            <div className="text-sm font-semibold">POR CUENTA Y ORDEN DE TERCEROS</div>
            <div className="text-xs">DOCUMENTO NO VÁLIDO COMO FACTURA</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b-2 border-gray-800 pb-4 mb-6 print:pb-2 print:mb-2">
      {/* Sección superior con el título centrado */}
      <div className="flex justify-center mb-4 print:mb-2">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-2 border-black w-8 h-8 flex items-center justify-center font-bold mr-2 print:w-6 print:h-6 print:text-sm">
              X
            </div>
            <div className="text-xl font-bold print:text-lg">RECIBO</div>
          </div>
          <div className="text-sm font-semibold print:text-xs">POR CUENTA Y ORDEN DE TERCEROS</div>
          <div className="text-xs print:text-[10px]">DOCUMENTO NO VÁLIDO COMO FACTURA</div>
        </div>
      </div>

      {/* Sección inferior con información de la empresa y datos fiscales */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 print:gap-2 print:flex-row">
        {/* Lado izquierdo - Logo y datos de la administración */}
        <div className="flex items-start gap-3 print:gap-2">
          <div className="w-16 h-16 relative flex-shrink-0 print:w-12 print:h-12">
            {headerConfig.logo ? (
              <img
                src={headerConfig.logo || "/placeholder.svg"}
                alt="Logo"
                className="w-16 h-16 object-contain print:w-12 print:h-12"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 print:w-12 print:h-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="print:w-4 print:h-4"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L9 18" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="text-xl font-bold print:text-base">{headerConfig.businessName}</div>
            <div className="text-sm print:text-xs">{headerConfig.ownerName}</div>
            <div className="text-xs mt-1 print:text-[10px] print:mt-0">{headerConfig.licenseInfo}</div>
            <div className="text-xs print:text-[10px]">{headerConfig.location}</div>
            <div className="text-xs print:text-[10px]">{headerConfig.phone}</div>
          </div>
        </div>

        {/* Lado derecho - Datos fiscales */}
        <div className="flex flex-col items-end">
          <div className="text-right text-sm print:text-xs">
            <div>CUIT: {headerConfig.taxId}</div>
            <div>ING. BRUTOS: {headerConfig.taxIdBrutos}</div>
            <div>INICIO DE ACTIVIDADES: {headerConfig.startDate}</div>
            <div className="font-semibold mt-1 print:mt-0">{headerConfig.taxStatus}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
