import { getHeaderConfig, saveHeaderConfig } from "@/lib/header-config-service.server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const config = await getHeaderConfig()
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error("API header-config GET: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const config = await saveHeaderConfig(data)
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error("API header-config POST: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
