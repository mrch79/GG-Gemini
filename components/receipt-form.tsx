"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2, Settings, AlertCircle, Calendar, User, Home } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import CustomSelect from "./custom-select"

export default function ReceiptForm() {
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState([])
  const [persons, setPersons] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedLocador, setSelectedLocador] = useState(null)
  const [selectedLocatario, setSelectedLocatario] = useState(null)
  const [concepts, setConcepts] = useState([])
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    propiedad: "",
    periodo: getCurrentPeriod(),
    locador: "",
    locadorCuit: "",
    locatario: "",
    locatarioCuit: "",
    tipo: "",
    direccion: "",
    localidad: "",
    observaciones: "",
    alquiler: "",
    aysa: "",
    edesur: "",
    municipal: "",
    iibb: "",
    otrosGastos: "",
  })
  const [error, setError] = useState(null)
  const [loadingData, setLoadingData] = useState({
    properties: true,
    persons: true,
    concepts: true,
  })
  const [formErrors, setFormErrors] = useState({})

  const router = useRouter()

  // Función para obtener el período actual (mes y año)
  function getCurrentPeriod() {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    const now = new Date()
    return `${months[now.getMonth()]} ${now.getFullYear()}`
  }

  // Función para cargar datos con manejo de errores mejorado
  const fetchData = async (url, dataType) => {
    try {
      setLoadingData((prev) => ({ ...prev, [dataType]: true }))
      console.log(`Cargando ${dataType} desde ${url}...`)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Respuesta de ${dataType}:`, data)

      if (!data.success) {
        throw new Error(data.error || `Error al cargar ${dataType}`)
      }

      return data
    } catch (error) {
      console.error(`Error cargando ${dataType}:`, error)
      setError(`Error al cargar ${dataType}: ${error.message}`)
      return { success: false, [dataType]: [] }
    } finally {
      setLoadingData((prev) => ({ ...prev, [dataType]: false }))
    }
  }

  useEffect(() => {
    // Cargar propiedades
    fetchData("/api/properties", "properties").then((data) => {
      if (data.success) {
        setProperties(Array.isArray(data.properties) ? data.properties : [])
      }
    })

    // Cargar personas (todos)
    fetchData("/api/persons", "persons").then((data) => {
      if (data.success) {
        setPersons(Array.isArray(data.persons) ? data.persons : [])
      }
    })

    // Cargar conceptos
    fetchData("/api/concepts", "concepts").then((data) => {
      if (data.success && Array.isArray(data.concepts)) {
        setConcepts(data.concepts)
      } else if (Array.isArray(data)) {
        setConcepts(data)
      } else {
        console.warn("Formato de datos de conceptos inesperado:", data)
        setConcepts([])
      }
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  // Manejador especial para campos numéricos
  const handleNumericInputChange = (e) => {
    const { name, value } = e.target

    // Permitir solo números, punto decimal y vacío
    // Regex: permite dígitos, un punto decimal opcional, y más dígitos opcionales después del punto
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({
        ...formData,
        [name]: value,
      })

      // Limpiar error del campo
      if (formErrors[name]) {
        setFormErrors({
          ...formErrors,
          [name]: null,
        })
      }
    }
  }

  const handlePropertyChange = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId)
    if (property) {
      setSelectedProperty(property)
      setFormData({
        ...formData,
        propiedad: property.propiedad,
        tipo: property.tipo,
        direccion: property.direccion,
        localidad: property.localidad,
      })

      // Limpiar errores relacionados
      setFormErrors({
        ...formErrors,
        propiedad: null,
        tipo: null,
        direccion: null,
        localidad: null,
      })
    }
  }

  const handleLocadorChange = (personId) => {
    const person = persons.find((p) => p.id === personId)
    if (person) {
      setSelectedLocador(person)
      setFormData({
        ...formData,
        locador: person.nombre,
        locadorCuit: person.cuit,
      })

      // Limpiar errores relacionados
      setFormErrors({
        ...formErrors,
        locador: null,
        locadorCuit: null,
      })
    }
  }

  const handleLocatarioChange = (personId) => {
    const person = persons.find((p) => p.id === personId)
    if (person) {
      setSelectedLocatario(person)
      setFormData({
        ...formData,
        locatario: person.nombre,
        locatarioCuit: person.cuit,
      })

      // Limpiar errores relacionados
      setFormErrors({
        ...formErrors,
        locatario: null,
        locatarioCuit: null,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    // Validar campos requeridos básicos
    if (!formData.fecha) errors.fecha = "La fecha es requerida"
    if (!formData.periodo) errors.periodo = "El período es requerido"
    if (!formData.propiedad) errors.propiedad = "La propiedad es requerida"
    if (!formData.locador) errors.locador = "El locador es requerido"
    if (!formData.locatario) errors.locatario = "El locatario es requerido"

    // Validar conceptos requeridos
    concepts.forEach((concept) => {
      if (concept.esRequerido) {
        const fieldName = concept.nombre.toLowerCase().replace(/\s+/g, "-")
        if (!formData[fieldName] || Number.parseFloat(formData[fieldName]) <= 0) {
          errors[fieldName] = `${concept.nombre} es requerido`
        }
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Preparar datos del formulario incluyendo los conceptos
      const formDataWithConcepts = { ...formData }

      // Añadir los valores de los conceptos al formData
      concepts.forEach((concept) => {
        const fieldName = concept.nombre.toLowerCase().replace(/\s+/g, "-")
        formDataWithConcepts[fieldName] = formData[fieldName] || ""
      })

      console.log("Enviando datos del recibo:", formDataWithConcepts)

      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithConcepts),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Recibo generado",
          description: "El recibo se ha generado correctamente",
        })

        // Usar setTimeout para dar tiempo a que se complete la transición del toast
        setTimeout(() => {
          router.push(`/recibo?id=${data.receipt.id}`)
        }, 500)
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error al generar el recibo: " + error.message)
      toast({
        title: "Error",
        description: "Error al generar el recibo: " + error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar locadores y locatarios
  const locadores = persons.filter((person) => person.tipo === "locador")
  const locatarios = persons.filter((person) => person.tipo === "locatario")

  // Preparar opciones para los selectores
  const propertyOptions = properties.map((property) => ({
    id: property.id,
    label: property.propiedad,
    sublabel: property.direccion,
    icon: <Home className="h-4 w-4 text-muted-foreground" />,
  }))

  const locadorOptions = locadores.map((person) => ({
    id: person.id,
    label: person.nombre,
    sublabel: person.cuit,
    icon: <User className="h-4 w-4 text-muted-foreground" />,
  }))

  const locatarioOptions = locatarios.map((person) => ({
    id: person.id,
    label: person.nombre,
    sublabel: person.cuit,
    icon: <User className="h-4 w-4 text-muted-foreground" />,
  }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generador de Recibos</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/historial">
              <Calendar className="mr-2 h-4 w-4" /> Ver Historial
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">
              <Settings className="mr-2 h-4 w-4" /> Administración
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Sección de datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fecha" className={formErrors.fecha ? "text-destructive" : ""}>
                Fecha {formErrors.fecha && <span className="text-xs">- {formErrors.fecha}</span>}
              </Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                className={formErrors.fecha ? "border-destructive" : ""}
              />
            </div>

            <div>
              <Label htmlFor="periodo" className={formErrors.periodo ? "text-destructive" : ""}>
                Período {formErrors.periodo && <span className="text-xs">- {formErrors.periodo}</span>}
              </Label>
              <Input
                id="periodo"
                name="periodo"
                placeholder="Ej: Enero 2023"
                value={formData.periodo}
                onChange={handleInputChange}
                required
                className={formErrors.periodo ? "border-destructive" : ""}
              />
            </div>

            <div>
              <Label htmlFor="propiedad" className={formErrors.propiedad ? "text-destructive" : ""}>
                Propiedad {formErrors.propiedad && <span className="text-xs">- {formErrors.propiedad}</span>}
              </Label>
              <CustomSelect
                options={propertyOptions}
                value={selectedProperty?.id || null}
                onChange={handlePropertyChange}
                placeholder="Seleccionar propiedad"
                searchPlaceholder="Buscar propiedad..."
                error={!!formErrors.propiedad}
                disabled={loadingData.properties}
                emptyMessage="No se encontraron propiedades"
                createNewLink={
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/admin">Crear nueva propiedad</Link>
                  </Button>
                }
              />
            </div>

            {selectedProperty && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <p>
                    <strong>Tipo:</strong> {selectedProperty.tipo}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedProperty.direccion}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {selectedProperty.localidad}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="locador" className={formErrors.locador ? "text-destructive" : ""}>
                Locador {formErrors.locador && <span className="text-xs">- {formErrors.locador}</span>}
              </Label>
              <CustomSelect
                options={locadorOptions}
                value={selectedLocador?.id || null}
                onChange={handleLocadorChange}
                placeholder="Seleccionar locador"
                searchPlaceholder="Buscar locador..."
                error={!!formErrors.locador}
                disabled={loadingData.persons}
                emptyMessage="No se encontraron locadores"
                createNewLink={
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/admin">Crear nuevo locador</Link>
                  </Button>
                }
              />
            </div>

            {selectedLocador && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <p>
                    <strong>CUIT:</strong> {selectedLocador.cuit}
                  </p>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="locatario" className={formErrors.locatario ? "text-destructive" : ""}>
                Locatario {formErrors.locatario && <span className="text-xs">- {formErrors.locatario}</span>}
              </Label>
              <CustomSelect
                options={locatarioOptions}
                value={selectedLocatario?.id || null}
                onChange={handleLocatarioChange}
                placeholder="Seleccionar locatario"
                searchPlaceholder="Buscar locatario..."
                error={!!formErrors.locatario}
                disabled={loadingData.persons}
                emptyMessage="No se encontraron locatarios"
                createNewLink={
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/admin">Crear nuevo locatario</Link>
                  </Button>
                }
              />
            </div>

            {selectedLocatario && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <p>
                    <strong>CUIT:</strong> {selectedLocatario.cuit}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sección de conceptos */}
        <div className="border p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4">Conceptos</h2>
          {loadingData.concepts ? (
            <div className="text-center py-4 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Cargando conceptos...
            </div>
          ) : concepts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No hay conceptos disponibles. Por favor, configure los conceptos en la sección de administración.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concepts.map((concept) => {
                const fieldName = concept.nombre.toLowerCase().replace(/\s+/g, "-")
                return (
                  <div key={concept.id}>
                    <Label htmlFor={fieldName} className={formErrors[fieldName] ? "text-destructive" : ""}>
                      {concept.nombre} {concept.esRequerido && <span className="text-red-500">*</span>}
                      {formErrors[fieldName] && <span className="text-xs ml-1">- {formErrors[fieldName]}</span>}
                    </Label>
                    <Input
                      id={fieldName}
                      name={fieldName}
                      placeholder={concept.descripcion || `Ingrese ${concept.nombre}`}
                      value={formData[fieldName] || ""}
                      onChange={handleNumericInputChange}
                      required={concept.esRequerido}
                      type="text"
                      inputMode="decimal"
                      className={cn("text-right", formErrors[fieldName] ? "border-destructive" : "")}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sección de observaciones */}
        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            name="observaciones"
            placeholder="Observaciones adicionales"
            value={formData.observaciones || ""}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...
              </>
            ) : (
              "Generar Recibo"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
