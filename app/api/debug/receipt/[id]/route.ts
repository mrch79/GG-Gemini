import { NextResponse } from "next/server"
import { query } from "@/lib/db.server"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`Debug API: Verificando recibo con ID: ${id}`)

    // Verificar si la tabla existe
    const tableCheckResult = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'receipts'
    `)

    const tableExists = (tableCheckResult.rows[0] as { count: number }).count > 0

    if (!tableExists) {
      return NextResponse.json(
        {
          success: false,
          error: "La tabla 'receipts' no existe en la base de datos",
        },
        { status: 404 },
      )
    }

    // Verificar si el recibo existe
    const receiptCheckResult = await query(
      `
      SELECT COUNT(*) as count 
      FROM receipts 
      WHERE id = ?
    `,
      [id],
    )

    const receiptExists = (receiptCheckResult.rows[0] as { count: number }).count > 0

    if (!receiptExists) {
      return NextResponse.json(
        {
          success: false,
          error: `No se encontró ningún recibo con ID: ${id}`,
        },
        { status: 404 },
      )
    }

    // Obtener el recibo
    const receiptResult = await query(
      `
      SELECT * 
      FROM receipts 
      WHERE id = ?
    `,
      [id],
    )

    return NextResponse.json({
      success: true,
      message: "Recibo encontrado",
      receipt: receiptResult.rows[0],
      debug: {
        tableExists,
        receiptExists,
        id,
      },
    })
  } catch (error) {
    console.error(`Debug API: Error al verificar recibo:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        debug: {
          id: params.id,
        },
      },
      { status: 500 },
    )
  }
}
