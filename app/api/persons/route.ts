import { NextResponse } from "next/server"
import { query } from "../../lib/db/index"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")

    let sql = "SELECT * FROM persons"
    const params: any[] = []

    if (tipo) {
      sql += " WHERE tipo = ?"
      params.push(tipo)
    }

    sql += " ORDER BY created_at DESC"

    console.log(`Obteniendo personas${tipo ? ` de tipo ${tipo}` : ""}...`)
    const result = await query(sql, params)
    console.log(`Personas encontradas: ${result.rows.length}`)

    return NextResponse.json({
      success: true,
      persons: result.rows,
    })
  } catch (error) {
    console.error("Error al obtener personas:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
