import { NextResponse } from "next/server"

// Conceptos predefinidos para la aplicación
const defaultConcepts = [
  {
    id: "1",
    nombre: "Alquiler",
    descripcion: "Monto del alquiler mensual",
    esRequerido: true,
  },
  {
    id: "2",
    nombre: "AySA",
    descripcion: "Servicio de agua",
    esRequerido: false,
  },
  {
    id: "3",
    nombre: "Edesur",
    descripcion: "Servicio de electricidad",
    esRequerido: false,
  },
  {
    id: "4",
    nombre: "Municipal",
    descripcion: "Impuestos municipales",
    esRequerido: false,
  },
  {
    id: "5",
    nombre: "IIBB",
    descripcion: "Impuesto a los ingresos brutos",
    esRequerido: false,
  },
  {
    id: "6",
    nombre: "Otros Gastos",
    descripcion: "Otros gastos adicionales",
    esRequerido: false,
  },
]

export async function GET() {
  try {
    // En una implementación real, estos conceptos vendrían de la base de datos
    return NextResponse.json({ success: true, concepts: defaultConcepts })
  } catch (error) {
    console.error("API concepts GET: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
