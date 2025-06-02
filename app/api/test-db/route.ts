import { NextResponse } from "next/server"
import { query } from "@/lib/db.server"

export async function GET() {
  try {
    // Test database connection
    const result = await query("SELECT NOW() as time")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      time: result.rows[0].time,
      env: {
        DB_HOST: process.env.DB_HOST || "db",
        DB_PORT: process.env.DB_PORT || "3306",
        DB_USER: process.env.DB_USER || "receipts_user",
        DB_NAME: process.env.DB_NAME || "receipts_db",
      },
    })
  } catch (error) {
    console.error("Error testing database connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        env: {
          DB_HOST: process.env.DB_HOST || "db",
          DB_PORT: process.env.DB_PORT || "3306",
          DB_USER: process.env.DB_USER || "receipts_user",
          DB_NAME: process.env.DB_NAME || "receipts_db",
        },
      },
      { status: 500 },
    )
  }
}
