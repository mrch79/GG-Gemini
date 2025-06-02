import { getReceiptById } from "@/lib/storage-service.server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")
    console.log(`API receipt-by-id: Recibida solicitud para recibo con ID: ${id}`)

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de recibo no proporcionado" }, { status: 400 })
    }

    const receipt = await getReceiptById(id)

    if (!receipt) {
      return NextResponse.json({ success: false, error: "Recibo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error("API receipt-by-id: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
