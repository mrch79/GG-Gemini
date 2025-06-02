import { NextResponse } from "next/server"
import { query } from "../../lib/db" // Actualizado para usar el barrel file

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "info"

    switch (action) {
      case "info":
        return await getDatabaseInfo()
      case "schema":
        return await getDatabaseSchema()
      case "stats":
        return await getDatabaseStats()
      default:
        return NextResponse.json({ success: false, error: `Acción desconocida: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en debug-db:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sql } = body

    if (!sql) {
      return NextResponse.json({ success: false, error: "Se requiere una consulta SQL" }, { status: 400 })
    }

    // Verificar si es una consulta de lectura (SELECT) para mayor seguridad
    const isReadQuery = sql.trim().toLowerCase().startsWith("select")

    if (!isReadQuery) {
      return NextResponse.json(
        {
          success: false,
          error: "Por seguridad, solo se permiten consultas SELECT en este endpoint",
        },
        { status: 400 },
      )
    }

    const result = await query(sql)
    return NextResponse.json({ success: true, result: result.rows })
  } catch (error) {
    console.error("Error ejecutando consulta SQL:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

async function getDatabaseInfo() {
  try {
    // Obtener información básica de la base de datos
    const versionResult = await query("SELECT VERSION() as version")
    const databaseResult = await query("SELECT DATABASE() as database_name")
    const tablesResult = await query(`
      SELECT table_name, table_rows
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      ORDER BY table_name
    `)

    return NextResponse.json({
      success: true,
      info: {
        version: versionResult.rows[0].version,
        database: databaseResult.rows[0].database_name,
        tables: tablesResult.rows,
      },
    })
  } catch (error) {
    console.error("Error obteniendo información de la base de datos:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

async function getDatabaseSchema() {
  try {
    // Obtener el esquema de todas las tablas
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      ORDER BY table_name
    `)

    const tables = tablesResult.rows as { table_name: string }[]
    const schema: Record<string, any[]> = {}

    // Para cada tabla, obtener sus columnas
    for (const table of tables) {
      const columnsResult = await query(
        `
        SELECT 
          column_name, 
          column_type,
          is_nullable,
          column_key,
          column_default,
          extra
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = ?
        ORDER BY ordinal_position
      `,
        [table.table_name],
      )

      schema[table.table_name] = columnsResult.rows
    }

    return NextResponse.json({
      success: true,
      schema,
    })
  } catch (error) {
    console.error("Error obteniendo esquema de la base de datos:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

async function getDatabaseStats() {
  try {
    // Obtener estadísticas de todas las tablas
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      ORDER BY table_name
    `)

    const tables = tablesResult.rows as { table_name: string }[]
    const stats: Record<string, { count: number; latest?: any }> = {}

    // Para cada tabla, obtener el conteo y el registro más reciente
    for (const table of tables) {
      const countResult = await query(`SELECT COUNT(*) as count FROM ${table.table_name}`)
      const count = (countResult.rows[0] as { count: number }).count

      let latest = null
      if (count > 0) {
        // Intentar obtener el registro más reciente si hay una columna created_at
        try {
          const latestResult = await query(`
            SELECT * FROM ${table.table_name}
            ORDER BY created_at DESC
            LIMIT 1
          `)
          latest = latestResult.rows[0]
        } catch (e) {
          // Si no hay columna created_at, simplemente obtener el primer registro
          const anyResult = await query(`SELECT * FROM ${table.table_name} LIMIT 1`)
          latest = anyResult.rows[0]
        }
      }

      stats[table.table_name] = {
        count,
        latest,
      }
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas de la base de datos:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
