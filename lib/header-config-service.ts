import { query } from "./db"

// Tipo para la configuración del encabezado
export interface HeaderConfig {
  id: string
  businessName: string
  ownerName: string
  licenseInfo: string
  location: string
  phone: string
  taxId: string
  taxIdBrutos: string
  startDate: string
  taxStatus: string
  logo?: string // Base64 encoded image
}

// Valores por defecto
export const defaultHeaderConfig: HeaderConfig = {
  id: "default",
  businessName: "G&G ADMINISTRACIÓN",
  ownerName: "de Gilda Faria",
  licenseInfo: "L.N. Agente de Cobro (1842)",
  location: "Provincia de Buenos Aires",
  phone: "Tel: 5317-4164",
  taxId: "27-30888523-8",
  taxIdBrutos: "27-30888523-8",
  startDate: "11/2015",
  taxStatus: "RESPONSABLE MONOTRIBUTO",
}

// Funciones para obtener y guardar la configuración
export const getHeaderConfig = async (): Promise<HeaderConfig> => {
  try {
    const result = await query("SELECT * FROM header_config LIMIT 1")

    if (result.rows.length > 0) {
      return result.rows[0]
    }

    // Si no hay configuración, crear una con los valores por defecto
    await saveHeaderConfig(defaultHeaderConfig)
    return defaultHeaderConfig
  } catch (error) {
    console.error("Error fetching header config:", error)
    return defaultHeaderConfig
  }
}

export const saveHeaderConfig = async (config: HeaderConfig): Promise<void> => {
  try {
    const result = await query("SELECT * FROM header_config WHERE id = $1", ["default"])

    if (result.rows.length > 0) {
      // Update existing config
      await query(
        `UPDATE header_config SET 
          "businessName" = $1, 
          "ownerName" = $2, 
          "licenseInfo" = $3, 
          location = $4, 
          phone = $5, 
          "taxId" = $6, 
          "taxIdBrutos" = $7, 
          "startDate" = $8, 
          "taxStatus" = $9, 
          logo = $10, 
          updated_at = NOW() 
        WHERE id = $11`,
        [
          config.businessName,
          config.ownerName,
          config.licenseInfo,
          config.location,
          config.phone,
          config.taxId,
          config.taxIdBrutos,
          config.startDate,
          config.taxStatus,
          config.logo,
          "default",
        ],
      )
    } else {
      // Insert new config
      await query(
        `INSERT INTO header_config (
          id, "businessName", "ownerName", "licenseInfo", 
          location, phone, "taxId", "taxIdBrutos", 
          "startDate", "taxStatus", logo, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          "default",
          config.businessName,
          config.ownerName,
          config.licenseInfo,
          config.location,
          config.phone,
          config.taxId,
          config.taxIdBrutos,
          config.startDate,
          config.taxStatus,
          config.logo,
        ],
      )
    }
  } catch (error) {
    console.error("Error saving header config:", error)
    throw error
  }
}
