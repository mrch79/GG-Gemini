import { v4 as uuidv4 } from "uuid"

// Variable para almacenar en caché si estamos usando SQLite
const _isSQLite = true

// Función para determinar si estamos usando SQLite
export async function isDatabaseMySQL(): Promise<boolean> {
  return false // Siempre usamos SQLite para simplificar
}

// Función para ejecutar consultas SQL
export async function query(sql: string, params: any[] = []): Promise<{ rows: any[] }> {
  console.log(`Ejecutando consulta: ${sql}`, params)

  // Simulamos una base de datos en memoria
  const mockDb = {
    header_config: [
      {
        id: "default",
        businessName: "G&G ADMINISTRACIÓN",
        ownerName: "de Gilda Faria",
        licenseInfo: "L.N. Agente de Cobro (1842)",
        location: "Provincia de Buenos Aires",
        phone: "Tel: 5317-4164",
        taxId: "27-30888523-8",
        taxIdBrutos: "27-30888523-8",
        startDate: "11/2015",
        taxStatus: "RESPONSABLE MONOTRIBUTO",
        logo: null,
      },
    ],
    properties: [],
    persons: [],
    receipts: [],
    concepts: [],
  }

  // Simulamos algunas operaciones básicas
  if (sql.includes("SELECT") && sql.includes("header_config")) {
    return { rows: mockDb.header_config }
  }

  if (sql.includes("INSERT INTO")) {
    return { rows: [{ id: uuidv4() }] }
  }

  // Por defecto, devolvemos un array vacío
  return { rows: [] }
}

// Función para obtener una conexión a la base de datos
export async function getDbConnection() {
  return {
    query: async (sql: string, params: any[] = []) => {
      const result = await query(sql, params)
      return [result.rows]
    },
  }
}
