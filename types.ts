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
  alquiler: string
  aysa?: string
  edesur?: string
  municipal?: string
  iibb?: string
  otrosGastos?: string
  observaciones?: string
}
