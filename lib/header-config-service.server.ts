// Tipo para la configuración del encabezado
export interface HeaderConfig {
  id?: string
  businessName: string
  ownerName: string
  licenseInfo: string
  location: string
  phone: string
  taxId: string
  taxIdBrutos: string
  startDate: string
  taxStatus: string
  logo: string | null
}

// Configuración predeterminada
const defaultConfig: HeaderConfig = {
  businessName: "G&G ADMINISTRACIÓN",
  ownerName: "de Gilda Faria",
  licenseInfo: "L.N. Agente de Cobro (1842)",
  location: "Provincia de Buenos Aires",
  phone: "Tel: 5317-4164",
  taxId: "27-30888523-8",
  taxIdBrutos: "27-30888523-8",
  startDate: "11/2015",
  taxStatus: "RESPONSABLE MONOTRIBUTO",
  logo: null,
}

// Variable para almacenar la configuración en memoria (simulando base de datos)
let currentConfig: HeaderConfig = { ...defaultConfig }

// Función para obtener la configuración predeterminada
export function getDefaultHeaderConfig(): HeaderConfig {
  return { ...defaultConfig }
}

// Función para obtener la configuración del encabezado
export async function getHeaderConfig(): Promise<HeaderConfig> {
  try {
    // En una implementación real, esto vendría de la base de datos
    return { ...currentConfig }
  } catch (error) {
    console.error("Error al obtener configuración del encabezado:", error)
    return getDefaultHeaderConfig()
  }
}

// Función para guardar la configuración del encabezado
export async function saveHeaderConfig(config: HeaderConfig): Promise<HeaderConfig> {
  try {
    // En una implementación real, esto se guardaría en la base de datos
    console.log("Guardando configuración del encabezado:", config)

    // Actualizar la configuración en memoria
    currentConfig = { ...config }

    return { ...currentConfig }
  } catch (error) {
    console.error("Error al guardar configuración del encabezado:", error)
    throw error
  }
}
