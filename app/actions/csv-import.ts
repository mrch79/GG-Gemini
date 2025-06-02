"use server"

import { query } from "../lib/db/index"
import { v4 as uuidv4 } from "uuid"
import { parse } from "csv-parse/sync"

// Función para importar propiedades desde un CSV
export async function importPropertiesFromCSV(
  formData: FormData,
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No se proporcionó ningún archivo" }
    }

    const content = await file.text()
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      return { success: false, message: "El archivo CSV no contiene datos" }
    }

    let insertedCount = 0

    for (const record of records) {
      // Validar que el registro tenga los campos necesarios
      if (!record.propiedad || !record.tipo || !record.direccion || !record.localidad) {
        console.warn("Registro incompleto, saltando:", record)
        continue
      }

      const id = uuidv4()

      await query(
        `INSERT INTO properties (id, propiedad, tipo, direccion, localidad) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, record.propiedad, record.tipo, record.direccion, record.localidad],
      )

      insertedCount++
    }

    return {
      success: true,
      message: `Se importaron ${insertedCount} propiedades correctamente`,
      count: insertedCount,
    }
  } catch (error) {
    console.error("Error al importar propiedades:", error)
    return {
      success: false,
      message: `Error al importar propiedades: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Función para importar personas (locadores o locatarios) desde un CSV
export async function importPersonsFromCSV(
  formData: FormData,
  tipo: "locador" | "locatario",
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No se proporcionó ningún archivo" }
    }

    const content = await file.text()
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      return { success: false, message: "El archivo CSV no contiene datos" }
    }

    let insertedCount = 0

    for (const record of records) {
      // Validar que el registro tenga los campos necesarios
      if (!record.nombre || !record.cuit) {
        console.warn("Registro incompleto, saltando:", record)
        continue
      }

      const id = uuidv4()

      await query(
        `INSERT INTO persons (id, nombre, cuit, tipo) 
         VALUES (?, ?, ?, ?)`,
        [id, record.nombre, record.cuit, tipo],
      )

      insertedCount++
    }

    const tipoLabel = tipo === "locador" ? "locadores" : "locatarios"

    return {
      success: true,
      message: `Se importaron ${insertedCount} ${tipoLabel} correctamente`,
      count: insertedCount,
    }
  } catch (error) {
    console.error(`Error al importar ${tipo === "locador" ? "locadores" : "locatarios"}:`, error)
    return {
      success: false,
      message: `Error al importar ${tipo === "locador" ? "locadores" : "locatarios"}: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Función específica para importar locadores
export async function importLocadoresFromCSV(
  formData: FormData,
): Promise<{ success: boolean; message: string; count?: number }> {
  return importPersonsFromCSV(formData, "locador")
}

// Función específica para importar locatarios
export async function importLocatariosFromCSV(
  formData: FormData,
): Promise<{ success: boolean; message: string; count?: number }> {
  return importPersonsFromCSV(formData, "locatario")
}
