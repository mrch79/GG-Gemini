import { NextResponse } from "next/server"
import { query } from "../../lib/db/index"

export async function GET() {
  try {
    console.log("Obteniendo todas las propiedades...")
    const result = await query("SELECT * FROM properties ORDER BY created_at DESC")
    console.log(`Propiedades encontradas: ${result.rows.length}`)

    return NextResponse.json({
      success: true,
      properties: result.rows,
    })
  } catch (error) {
    console.error("Error al obtener propiedades:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
