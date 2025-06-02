import { NextResponse } from "next/server"
import { query } from "../../../lib/db/index"

export async function GET() {
  try {
    console.log("Exportando propiedades...")

    // Obtener todas las propiedades
    const result = await query("SELECT * FROM properties ORDER BY created_at DESC")
    const properties = result.rows

    // Crear el contenido CSV
    let csvContent = "propiedad,tipo,direccion,localidad\n"

    properties.forEach((property) => {
      csvContent += `"${property.propiedad}","${property.tipo}","${property.direccion}","${property.localidad}"\n`
    })

    // Crear una respuesta con el contenido CSV
    const response = new NextResponse(csvContent)

    // Establecer los encabezados adecuados para la descarga
    response.headers.set("Content-Type", "text/csv; charset=utf-8")
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="propiedades_${new Date().toISOString().split("T")[0]}.csv"`,
    )

    return response
  } catch (error) {
    console.error("Error al exportar propiedades:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
