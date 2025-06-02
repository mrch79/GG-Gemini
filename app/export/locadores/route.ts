import { NextResponse } from "next/server"
import { query } from "../../lib/db/index"

export async function GET() {
  try {
    console.log("Exportando locadores...")

    // Obtener todos los locadores
    const result = await query("SELECT * FROM persons WHERE tipo = 'locador' ORDER BY created_at DESC")
    const locadores = result.rows

    // Crear el contenido CSV
    let csvContent = "nombre,cuit\n"

    locadores.forEach((locador) => {
      csvContent += `"${locador.nombre}","${locador.cuit}"\n`
    })

    // Crear una respuesta con el contenido CSV
    const response = new NextResponse(csvContent)

    // Establecer los encabezados adecuados para la descarga
    response.headers.set("Content-Type", "text/csv; charset=utf-8")
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="locadores_${new Date().toISOString().split("T")[0]}.csv"`,
    )

    return response
  } catch (error) {
    console.error("Error al exportar locadores:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
