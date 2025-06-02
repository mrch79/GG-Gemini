"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import type { Receipt } from "@/lib/storage-service.server"
import { Loader2, Search, X, ArrowLeft, Plus, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function ReceiptHistory() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "property" | "tenant">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterProperty, setFilterProperty] = useState<string>("")

  // Extract unique properties for filter dropdown
  const uniqueProperties = useMemo(() => {
    const properties = new Set<string>()
    receipts.forEach((receipt) => {
      if (receipt.propiedad) {
        properties.add(receipt.propiedad)
      }
    })
    return Array.from(properties).sort()
  }, [receipts])

  useEffect(() => {
    loadReceipts()
  }, [])

  useEffect(() => {
    filterAndSortReceipts()
  }, [searchTerm, receipts, sortBy, sortOrder, filterProperty])

  const loadReceipts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/receipts")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al cargar los recibos")
      }

      console.log("Recibos cargados:", data.receipts)
      setReceipts(Array.isArray(data.receipts) ? data.receipts : [])
    } catch (error) {
      console.error("Error loading receipts:", error)
      setError(error instanceof Error ? error.message : "Error al cargar los recibos")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortReceipts = () => {
    try {
      // First filter
      let filtered = [...receipts]

      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim()
        filtered = filtered.filter((receipt) => {
          return (
            (receipt.propiedad && receipt.propiedad.toLowerCase().includes(term)) ||
            (receipt.locador && receipt.locador.toLowerCase().includes(term)) ||
            (receipt.locatario && receipt.locatario.toLowerCase().includes(term)) ||
            (receipt.direccion && receipt.direccion.toLowerCase().includes(term)) ||
            (receipt.periodo && receipt.periodo.toLowerCase().includes(term))
          )
        })
      }

      // Apply property filter if selected
      if (filterProperty && filterProperty !== "all") {
        filtered = filtered.filter((receipt) => receipt.propiedad === filterProperty)
      }

      // Then sort
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "asc"
            ? new Date(a.fecha || "").getTime() - new Date(b.fecha || "").getTime()
            : new Date(b.fecha || "").getTime() - new Date(a.fecha || "").getTime()
        } else if (sortBy === "property") {
          const propA = a.propiedad || ""
          const propB = b.propiedad || ""
          return sortOrder === "asc" ? propA.localeCompare(propB) : propB.localeCompare(propA)
        } else {
          // tenant
          const tenantA = a.locatario || ""
          const tenantB = b.locatario || ""
          return sortOrder === "asc" ? tenantA.localeCompare(tenantB) : tenantB.localeCompare(tenantA)
        }
      })

      setFilteredReceipts(filtered)
    } catch (error) {
      console.error("Error filtering receipts:", error)
      setError(error instanceof Error ? error.message : "Error al filtrar los recibos")
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterProperty("")
    setSortBy("date")
    setSortOrder("desc")
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
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

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Historial de Recibos</h1>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Generar Recibos
            </Link>
          </Button>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadReceipts}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historial de Recibos</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Recibo
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar y Filtrar Recibos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative col-span-2">
              <Input
                placeholder="Buscar por propiedad, locador, locatario, dirección o período..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <div>
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las propiedades</SelectItem>
                  {uniqueProperties.map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="property">Propiedad</SelectItem>
                  <SelectItem value="tenant">Locatario</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>

              <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpiar filtros">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 flex justify-between">
            <span>{filteredReceipts.length} recibos encontrados</span>
            {(searchTerm || filterProperty || sortBy !== "date" || sortOrder !== "desc") && (
              <Button variant="link" size="sm" onClick={clearFilters} className="h-auto p-0">
                Limpiar todos los filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center p-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando recibos...</p>
        </div>
      ) : filteredReceipts.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <p className="text-lg mb-4">No se encontraron recibos</p>
          {searchTerm && (
            <Button variant="outline" onClick={clearSearch} className="mr-2">
              Limpiar búsqueda
            </Button>
          )}
          <Button asChild>
            <Link href="/">Crear nuevo recibo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceipts.map((receipt) => (
            <Link href={`/recibo?id=${receipt.id}`} key={receipt.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold truncate max-w-[70%]">{receipt.propiedad}</div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">{formatDateSafe(receipt.fecha || "")}</div>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Período:</span> {receipt.periodo}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Locador:</span> {receipt.locador}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Locatario:</span> {receipt.locatario}
                  </div>
                  <div className="text-sm mb-2 truncate">
                    <span className="font-medium">Dirección:</span> {receipt.direccion}
                  </div>
                  <div className="text-sm font-medium text-right mt-4">Total: ${calculateTotal(receipt)}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function calculateTotal(receipt: Receipt): string {
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
