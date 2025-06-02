import { v4 as uuidv4 } from "uuid"

// Tipo para los recibos
export interface Receipt {
  id: string
  fecha: string
  propiedad: string
  periodo: string
  locador: string
  locadorCuit: string
  locatario: string
  locatarioCuit: string
  tipo: string
  direccion: string
  localidad: string
  alquiler?: string
  aysa?: string
  edesur?: string
  municipal?: string
  iibb?: string
  otrosGastos?: string
  observaciones?: string
  [key: string]: string | undefined // Para permitir campos dinámicos
}

// Tipo para las propiedades
export interface Property {
  id: string
  propiedad: string
  tipo: string
  direccion: string
  localidad: string
}

// Tipo para las personas
export interface Person {
  id: string
  nombre: string
  cuit: string
  tipo: string // locador o locatario
}

// Datos simulados para desarrollo
const mockReceipts: Receipt[] = [
  {
    id: "1",
    fecha: "2023-05-01",
    propiedad: "Propiedad 1",
    periodo: "Mayo 2023",
    locador: "Juan Pérez",
    locadorCuit: "20-12345678-9",
    locatario: "María López",
    locatarioCuit: "27-98765432-1",
    tipo: "Departamento",
    direccion: "Av. Corrientes 1234",
    localidad: "CABA",
    alquiler: "150000",
    aysa: "5000",
    edesur: "7500",
    municipal: "3000",
    iibb: "2000",
    otrosGastos: "1500",
    observaciones: "Pago en término",
  },
  {
    id: "2",
    fecha: "2023-06-01",
    propiedad: "Propiedad 2",
    periodo: "Junio 2023",
    locador: "Carlos Rodríguez",
    locadorCuit: "20-23456789-0",
    locatario: "Ana Martínez",
    locatarioCuit: "27-87654321-0",
    tipo: "Local Comercial",
    direccion: "Av. Santa Fe 5678",
    localidad: "CABA",
    alquiler: "200000",
    aysa: "6000",
    edesur: "9000",
    municipal: "4000",
    iibb: "2500",
    otrosGastos: "2000",
    observaciones: "",
  },
]

let mockProperties: Property[] = [
  {
    id: "1",
    propiedad: "Propiedad 1",
    tipo: "Departamento",
    direccion: "Av. Corrientes 1234",
    localidad: "CABA",
  },
  {
    id: "2",
    propiedad: "Propiedad 2",
    tipo: "Local Comercial",
    direccion: "Av. Santa Fe 5678",
    localidad: "CABA",
  },
]

let mockPersons: Person[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    cuit: "20-12345678-9",
    tipo: "locador",
  },
  {
    id: "2",
    nombre: "María López",
    cuit: "27-98765432-1",
    tipo: "locatario",
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    cuit: "20-23456789-0",
    tipo: "locador",
  },
  {
    id: "4",
    nombre: "Ana Martínez",
    cuit: "27-87654321-0",
    tipo: "locatario",
  },
]

// Función para obtener todos los recibos
export async function getReceipts(): Promise<Receipt[]> {
  try {
    // En una implementación real, esto vendría de la base de datos
    console.log("Obteniendo todos los recibos:", mockReceipts)
    return [...mockReceipts]
  } catch (error) {
    console.error("Error al obtener recibos:", error)
    throw error
  }
}

// Función para obtener un recibo por ID
export async function getReceiptById(id: string): Promise<Receipt | null> {
  try {
    console.log(`Simulando consulta: SELECT * FROM receipts WHERE id = ?`, [id])

    // En una implementación real, esto vendría de la base de datos
    const receipt = mockReceipts.find((r) => r.id === id)
    console.log(`API receipt-by-id: Resultado de la consulta:`, receipt ? receipt : "No encontrado")

    return receipt || null
  } catch (error) {
    console.error("Error al obtener recibo por ID:", error)
    throw error
  }
}

// Función para guardar un recibo
export async function saveReceipt(receiptData: Omit<Receipt, "id">): Promise<Receipt> {
  try {
    // Normalizar los nombres de campos con guiones
    const normalizedData: any = { ...receiptData }

    // Si hay un campo otros-gastos, copiarlo a otrosGastos
    if (normalizedData["otros-gastos"] && !normalizedData.otrosGastos) {
      normalizedData.otrosGastos = normalizedData["otros-gastos"]
    }

    const newReceipt: Receipt = {
      id: uuidv4(),
      ...normalizedData,
    }

    // En una implementación real, esto se guardaría en la base de datos
    mockReceipts.push(newReceipt)
    console.log("Recibo guardado:", newReceipt)
    console.log("Total de recibos:", mockReceipts.length)

    return newReceipt
  } catch (error) {
    console.error("Error al guardar recibo:", error)
    throw error
  }
}

// Función para obtener todas las propiedades
export async function getProperties(): Promise<Property[]> {
  try {
    // En una implementación real, esto vendría de la base de datos
    return [...mockProperties]
  } catch (error) {
    console.error("Error al obtener propiedades:", error)
    throw error
  }
}

// Función para guardar una propiedad
export async function saveProperty(propertyData: Omit<Property, "id">): Promise<Property> {
  try {
    const newProperty: Property = {
      id: uuidv4(),
      ...propertyData,
    }

    // En una implementación real, esto se guardaría en la base de datos
    mockProperties.push(newProperty)

    return newProperty
  } catch (error) {
    console.error("Error al guardar propiedad:", error)
    throw error
  }
}

// Función para eliminar una propiedad
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    // En una implementación real, esto eliminaría de la base de datos
    const initialLength = mockProperties.length
    mockProperties = mockProperties.filter((p) => p.id !== id)

    return mockProperties.length < initialLength
  } catch (error) {
    console.error("Error al eliminar propiedad:", error)
    throw error
  }
}

// Función para obtener todas las personas
export async function getPersons(): Promise<Person[]> {
  try {
    // En una implementación real, esto vendría de la base de datos
    return [...mockPersons]
  } catch (error) {
    console.error("Error al obtener personas:", error)
    throw error
  }
}

// Función para obtener personas por tipo
export async function getPersonsByType(tipo: string): Promise<Person[]> {
  try {
    // En una implementación real, esto vendría de la base de datos
    return mockPersons.filter((p) => p.tipo === tipo)
  } catch (error) {
    console.error(`Error al obtener personas por tipo ${tipo}:`, error)
    throw error
  }
}

// Función para guardar una persona
export async function savePerson(personData: Omit<Person, "id">): Promise<Person> {
  try {
    const newPerson: Person = {
      id: uuidv4(),
      ...personData,
    }

    // En una implementación real, esto se guardaría en la base de datos
    mockPersons.push(newPerson)

    return newPerson
  } catch (error) {
    console.error("Error al guardar persona:", error)
    throw error
  }
}

// Función para eliminar una persona
export async function deletePerson(id: string): Promise<boolean> {
  try {
    // En una implementación real, esto eliminaría de la base de datos
    const initialLength = mockPersons.length
    mockPersons = mockPersons.filter((p) => p.id !== id)

    return mockPersons.length < initialLength
  } catch (error) {
    console.error("Error al eliminar persona:", error)
    throw error
  }
}

// Función para verificar si una persona existe
export async function personExists(cuit: string): Promise<boolean> {
  try {
    // En una implementación real, esto consultaría la base de datos
    return mockPersons.some((p) => p.cuit === cuit)
  } catch (error) {
    console.error("Error al verificar si la persona existe:", error)
    throw error
  }
}
