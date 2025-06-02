import mysql from "mysql2/promise"

// Pool de conexiones a la base de datos
let pool: mysql.Pool | null = null

// Función para obtener el pool de conexiones
async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "receipts_user",
      password: process.env.DB_PASSWORD || "receipts_password",
      database: process.env.DB_NAME || "receipts_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    console.log(`Conexión a la base de datos establecida: ${process.env.DB_HOST}:${process.env.DB_PORT}`)

    // Verificar que las tablas existan
    await ensureTablesExist()
  }

  return pool
}

// Función para asegurar que las tablas necesarias existan
async function ensureTablesExist() {
  try {
    const pool = await getPool()

    // Verificar si la tabla properties existe
    const [propertiesResult] = await pool.query(
      `
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'properties'
    `,
      [process.env.DB_NAME],
    )

    // @ts-ignore
    if (propertiesResult[0].count === 0) {
      console.log("Creando tabla properties...")
      await pool.query(`
        CREATE TABLE properties (
          id VARCHAR(36) PRIMARY KEY,
          propiedad VARCHAR(255) NOT NULL,
          tipo VARCHAR(255) NOT NULL,
          direccion VARCHAR(255) NOT NULL,
          localidad VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Tabla properties creada exitosamente")
    }

    // Verificar si la tabla persons existe
    const [personsResult] = await pool.query(
      `
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'persons'
    `,
      [process.env.DB_NAME],
    )

    // @ts-ignore
    if (personsResult[0].count === 0) {
      console.log("Creando tabla persons...")
      await pool.query(`
        CREATE TABLE persons (
          id VARCHAR(36) PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          cuit VARCHAR(255) NOT NULL,
          tipo ENUM('locador', 'locatario') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Tabla persons creada exitosamente")
    }
  } catch (error) {
    console.error("Error al verificar/crear tablas:", error)
  }
}

// Función para determinar si estamos usando MySQL
export async function isDatabaseMySQL(): Promise<boolean> {
  return true
}

// Función para ejecutar consultas SQL
export async function query(sql: string, params: any[] = []): Promise<{ rows: any[] }> {
  try {
    console.log(`Ejecutando consulta: ${sql}`, params)

    const pool = await getPool()
    const [rows] = await pool.query(sql, params)

    console.log(`Consulta ejecutada exitosamente. Resultados:`, Array.isArray(rows) ? rows.length : "objeto")

    return { rows: rows as any[] }
  } catch (error) {
    console.error("Error al ejecutar consulta SQL:", error)
    throw error
  }
}

// Función para obtener una conexión a la base de datos
export async function getDbConnection() {
  const pool = await getPool()

  return {
    query: async (sql: string, params: any[] = []) => {
      const [rows] = await pool.query(sql, params)
      return [rows]
    },
  }
}
