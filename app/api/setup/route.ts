import { NextResponse } from "next/server"
import { query } from "@/lib/db.server"

export async function GET() {
  try {
    console.log("Setting up database tables...")

    // Create properties table
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

    // Create persons table
    await query(`
      CREATE TABLE IF NOT EXISTS persons (
        id VARCHAR(36) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        cuit VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('locador', 'locatario')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Persons table created")

    // Create receipts table
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

    // Create header_config table
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

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
