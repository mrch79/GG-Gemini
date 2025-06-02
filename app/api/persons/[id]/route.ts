import { NextResponse } from "next/server"
import { deletePerson } from "@/lib/storage-service.server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await deletePerson(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting person:", error)
    return NextResponse.json({ success: false, error: "Error deleting person" }, { status: 500 })
  }
}
