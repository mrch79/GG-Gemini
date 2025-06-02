import { Suspense } from "react"
import ReceiptView from "@/components/receipt-view"

// Marcar la página como dinámica para asegurar que siempre se renderice en el servidor
export const dynamic = "force-dynamic"
export const revalidate = 0 // No cache

export default function ReceiptPage({ params }: { params: { id: string } }) {
  console.log(`Page: Renderizando página de recibo para ID: ${params.id}`)

  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="text-center p-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
            <p className="mt-4">Cargando recibo...</p>
          </div>
        }
      >
        <ReceiptView id={params.id} />
      </Suspense>
    </div>
  )
}
