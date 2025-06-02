import { NextResponse } from "next/server"
import { getReceiptById } from "@/lib/storage-service.server"

// Asegurarse de que la ruta sea dinámica
export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`API: Recibida solicitud para recibo con ID: ${id}`)

    if (!id) {
      console.error("API: No se proporcionó ID")
      return NextResponse.json({ success: false, error: "No se proporcionó ID" }, { status: 400 })
    }

    // Usar la función del servicio para obtener el recibo
    const receipt = await getReceiptById(id)

    if (!receipt) {
      console.error(`API: Recibo no encontrado con ID: ${id}`)
      return NextResponse.json({ success: false, error: "Recibo no encontrado" }, { status: 404 })
    }

    console.log(`API: Recibo encontrado exitosamente:`, receipt)
    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error(`API: Error al obtener recibo con ID ${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
