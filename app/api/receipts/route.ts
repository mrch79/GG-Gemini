import { getReceipts, saveReceipt } from "@/lib/storage-service.server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const receipts = await getReceipts()
    return NextResponse.json({ success: true, receipts })
  } catch (error) {
    console.error("API receipts GET: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const receipt = await saveReceipt(data)
    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error("API receipts POST: Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
