"use server"

import { query } from "./db.server"

// Check if a table exists in the database
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = ?
    `,
      [tableName],
    )

    return (result.rows[0] as { count: number }).count > 0
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

// Initialize the database if tables don't exist
export async function initializeDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Checking if database needs initialization...")

    // Check if the main tables exist
    const propertiesExist = await tableExists("properties")
    const personsExist = await tableExists("persons")
    const receiptsExist = await tableExists("receipts")
    const headerConfigExists = await tableExists("header_config")

    // If all tables exist, no need to initialize
    if (propertiesExist && personsExist && receiptsExist && headerConfigExists) {
      console.log("Database already initialized, skipping setup")
      return {
        success: true,
        message: "Database already initialized",
      }
    }

    console.log("Setting up database tables...")

    // Create properties table if it doesn't exist
    if (!propertiesExist) {
      await query(`
        CREATE TABLE IF NOT EXISTS properties (
          id VARCHAR(36) PRIMARY KEY,
          propiedad VARCHAR(255) NOT NULL,
          tipo VARCHAR(255) NOT NULL,
          direccion TEXT NOT NULL,
          localidad VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Properties table created")
    }

    // Create persons table if it doesn't exist
    if (!personsExist) {
      await query(`
        CREATE TABLE IF NOT EXISTS persons (
          id VARCHAR(36) PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          cuit VARCHAR(255) NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CHECK (tipo IN ('locador', 'locatario'))
        )
      `)
      console.log("Persons table created")
    }

    // Create receipts table if it doesn't exist
    if (!receiptsExist) {
      await query(`
        CREATE TABLE IF NOT EXISTS receipts (
          id VARCHAR(36) PRIMARY KEY,
          fecha DATE NOT NULL,
          propiedad VARCHAR(255) NOT NULL,
          periodo VARCHAR(255) NOT NULL,
          locador VARCHAR(255) NOT NULL,
          locadorCuit VARCHAR(255) NOT NULL,
          locatario VARCHAR(255) NOT NULL,
          locatarioCuit VARCHAR(255) NOT NULL,
          tipo VARCHAR(255) NOT NULL,
          direccion TEXT NOT NULL,
          localidad VARCHAR(255) NOT NULL,
          alquiler VARCHAR(255) NOT NULL,
          aysa VARCHAR(255),
          edesur VARCHAR(255),
          municipal VARCHAR(255),
          iibb VARCHAR(255),
          otrosGastos VARCHAR(255),
          observaciones TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Receipts table created")
    }

    // Create header_config table if it doesn't exist
    if (!headerConfigExists) {
      await query(`
        CREATE TABLE IF NOT EXISTS header_config (
          id VARCHAR(50) PRIMARY KEY,
          businessName VARCHAR(255) NOT NULL,
          ownerName VARCHAR(255) NOT NULL,
          licenseInfo VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          taxId VARCHAR(255) NOT NULL,
          taxIdBrutos VARCHAR(255) NOT NULL,
          startDate VARCHAR(255) NOT NULL,
          taxStatus VARCHAR(255) NOT NULL,
          logo TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Header config table created")
    }

    return {
      success: true,
      message: "Database initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: `Error initializing database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
