import { query } from "./db"

// Simple adapter to handle database operations with error handling
export async function executeQuery<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const result = await query(sql, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function executeSingleResultQuery<T = any>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const result = await query(sql, params)
    return result.rows.length > 0 ? (result.rows[0] as T) : null
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function executeNonQuery(sql: string, params?: any[]): Promise<number> {
  try {
    const result = await query(sql, params)
    return result.rowCount
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
