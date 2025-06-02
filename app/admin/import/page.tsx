import CSVImportForm from "../../components/csv-import-form"
import CSVTemplates from "../../components/csv-templates"
import PropertyDisplay from "../../components/property-display"
import LocadoresDisplay from "../../components/locadores-display"
import LocatariosDisplay from "../../components/locatarios-display"

export default function ImportPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Importar datos</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <CSVImportForm />
        <div>
          <CSVTemplates />
        </div>
      </div>
      <div className="mt-8 space-y-8">
        <PropertyDisplay />
        <div className="grid gap-6 md:grid-cols-2">
          <LocadoresDisplay />
          <LocatariosDisplay />
        </div>
      </div>
    </div>
  )
}
