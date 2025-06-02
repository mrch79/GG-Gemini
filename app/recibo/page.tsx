"use client"

import { useSearchParams } from "next/navigation"
import ReceiptView from "@/components/receipt-view"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ReceiptPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (!id) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>No se ha especificado un ID de recibo válido.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <ReceiptView id={id} />
    </div>
  )
}
