import { NextResponse } from "next/server"
import { deleteProperty } from "@/lib/storage-service.server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await deleteProperty(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ success: false, error: "Error deleting property" }, { status: 500 })
  }
}
