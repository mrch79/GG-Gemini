import { NextResponse } from "next/server"
import { query } from "../../lib/db/index"

export async function GET() {
  try {
    console.log("Exportando locatarios...")

    // Obtener todos los locatarios
    const result = await query("SELECT * FROM persons WHERE tipo = 'locatario' ORDER BY created_at DESC")
    const locatarios = result.rows

    // Crear el contenido CSV
    let csvContent = "nombre,cuit\n"

    locatarios.forEach((locatario) => {
      csvContent += `"${locatario.nombre}","${locatario.cuit}"\n`
    })

    // Crear una respuesta con el contenido CSV
    const response = new NextResponse(csvContent)

    // Establecer los encabezados adecuados para la descarga
    response.headers.set("Content-Type", "text/csv; charset=utf-8")
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="locatarios_${new Date().toISOString().split("T")[0]}.csv"`,
    )

    return response
  } catch (error) {
    console.error("Error al exportar locatarios:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
