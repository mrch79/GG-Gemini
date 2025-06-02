"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PropertyList from "@/components/property-list"
import PersonList from "@/components/person-list"
import PropertyForm from "@/components/property-form"
import PersonForm from "@/components/person-form"
import HeaderConfigForm from "@/components/header-config-form"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("properties")
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showLocadorForm, setShowLocadorForm] = useState(false)
  const [showLocatarioForm, setShowLocatarioForm] = useState(false)

  const handlePropertyFormSuccess = () => {
    setShowPropertyForm(false)
    // Recargar la lista de propiedades
    // En una implementación real, esto podría ser manejado con un estado global o un contexto
  }

  const handleLocadorFormSuccess = () => {
    setShowLocadorForm(false)
    // Recargar la lista de personas
  }

  const handleLocatarioFormSuccess = () => {
    setShowLocatarioForm(false)
    // Recargar la lista de personas
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración</h1>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="persons">Personas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          {showPropertyForm ? (
            <PropertyForm onSuccess={handlePropertyFormSuccess} onCancel={() => setShowPropertyForm(false)} />
          ) : (
            <PropertyList onAddNew={() => setShowPropertyForm(true)} />
          )}
        </TabsContent>

        <TabsContent value="persons" className="space-y-4">
          {showLocadorForm ? (
            <PersonForm
              defaultType="locador"
              onSuccess={handleLocadorFormSuccess}
              onCancel={() => setShowLocadorForm(false)}
            />
          ) : showLocatarioForm ? (
            <PersonForm
              defaultType="locatario"
              onSuccess={handleLocatarioFormSuccess}
              onCancel={() => setShowLocatarioForm(false)}
            />
          ) : (
            <PersonList
              onAddLocador={() => setShowLocadorForm(true)}
              onAddLocatario={() => setShowLocatarioForm(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <HeaderConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
