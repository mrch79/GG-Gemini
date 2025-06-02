"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DebugDbPage() {
  const [activeTab, setActiveTab] = useState("info")
  const [loading, setLoading] = useState(false)
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [dbSchema, setDbSchema] = useState<any>(null)
  const [dbStats, setDbStats] = useState<any>(null)
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM receipts LIMIT 10")
  const [queryResult, setQueryResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === "info" && !dbInfo) {
      fetchDatabaseInfo()
    } else if (activeTab === "schema" && !dbSchema) {
      fetchDatabaseSchema()
    } else if (activeTab === "stats" && !dbStats) {
      fetchDatabaseStats()
    }
  }, [activeTab])

  const fetchDatabaseInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug-db?action=info")
      const data = await response.json()
      if (data.success) {
        setDbInfo(data.info)
      } else {
        setError(data.error || "Error al obtener información de la base de datos")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const fetchDatabaseSchema = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug-db?action=schema")
      const data = await response.json()
      if (data.success) {
        setDbSchema(data.schema)
      } else {
        setError(data.error || "Error al obtener el esquema de la base de datos")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const fetchDatabaseStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug-db?action=stats")
      const data = await response.json()
      if (data.success) {
        setDbStats(data.stats)
      } else {
        setError(data.error || "Error al obtener estadísticas de la base de datos")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    setQueryResult(null)
    try {
      const response = await fetch("/api/debug-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: sqlQuery }),
      })
      const data = await response.json()
      if (data.success) {
        setQueryResult(data.result)
      } else {
        setError(data.error || "Error al ejecutar la consulta")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AdmiGG - Depuración de Base de Datos</h1>
        <Button asChild>
          <Link href="/admin">Volver al Panel de Administración</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="schema">Esquema</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="query">Consulta SQL</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Base de Datos</CardTitle>
              <CardDescription>Información general sobre la base de datos</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Cargando información...</div>
              ) : dbInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2">Versión</h3>
                      <p>{dbInfo.version}</p>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2">Base de Datos</h3>
                      <p>{dbInfo.database}</p>
                    </div>
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Tablas</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Nombre</th>
                          <th className="text-right py-2">Filas (aprox.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbInfo.tables.map((table: any) => (
                          <tr key={table.table_name} className="border-b">
                            <td className="py-2">{table.table_name}</td>
                            <td className="text-right py-2">{table.table_rows || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">No hay información disponible</div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchDatabaseInfo} disabled={loading}>
                Actualizar Información
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Esquema de la Base de Datos</CardTitle>
              <CardDescription>Estructura de tablas y columnas</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Cargando esquema...</div>
              ) : dbSchema ? (
                <div className="space-y-6">
                  {Object.entries(dbSchema).map(([tableName, columns]) => (
                    <div key={tableName} className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2 text-lg">{tableName}</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Columna</th>
                            <th className="text-left py-2">Tipo</th>
                            <th className="text-left py-2">Nulo</th>
                            <th className="text-left py-2">Clave</th>
                            <th className="text-left py-2">Predeterminado</th>
                            <th className="text-left py-2">Extra</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(columns as any[]).map((column: any, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{column.column_name}</td>
                              <td className="py-2">{column.column_type}</td>
                              <td className="py-2">{column.is_nullable}</td>
                              <td className="py-2">{column.column_key || "-"}</td>
                              <td className="py-2">{column.column_default || "-"}</td>
                              <td className="py-2">{column.extra || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">No hay información de esquema disponible</div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchDatabaseSchema} disabled={loading}>
                Actualizar Esquema
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de la Base de Datos</CardTitle>
              <CardDescription>Conteo de registros y datos recientes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Cargando estadísticas...</div>
              ) : dbStats ? (
                <div className="space-y-6">
                  {Object.entries(dbStats).map(([tableName, stats]: [string, any]) => (
                    <div key={tableName} className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2 text-lg">{tableName}</h3>
                      <div className="mb-2">
                        <span className="font-medium">Total de registros:</span> {stats.count}
                      </div>
                      {stats.count > 0 && stats.latest && (
                        <div>
                          <h4 className="font-medium mb-1">Registro más reciente:</h4>
                          <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto text-xs">
                            {JSON.stringify(stats.latest, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">No hay estadísticas disponibles</div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchDatabaseStats} disabled={loading}>
                Actualizar Estadísticas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle>Consulta SQL</CardTitle>
              <CardDescription>Ejecutar consultas SQL personalizadas (solo SELECT)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Ingrese su consulta SQL aquí..."
                    className="font-mono"
                    rows={5}
                  />
                </div>

                <Button onClick={executeQuery} disabled={loading}>
                  {loading ? "Ejecutando..." : "Ejecutar Consulta"}
                </Button>

                {queryResult && (
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Resultados ({queryResult.length} filas)</h3>
                    {queryResult.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              {Object.keys(queryResult[0]).map((key) => (
                                <th key={key} className="text-left py-2 px-2">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.map((row: any, rowIndex: number) => (
                              <tr key={rowIndex} className="border-b">
                                {Object.values(row).map((value: any, colIndex: number) => (
                                  <td key={colIndex} className="py-2 px-2">
                                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No se encontraron resultados</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
