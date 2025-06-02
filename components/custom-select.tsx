"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  label: string
  sublabel?: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  options: Option[]
  value: string | null
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  emptyMessage?: string
  createNewLink?: React.ReactNode
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Buscar...",
  className,
  error = false,
  disabled = false,
  emptyMessage = "No se encontraron resultados",
  createNewLink,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Actualizar opciones filtradas cuando cambian las opciones o el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options)
      return
    }

    const normalizedSearchTerm = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    const filtered = options.filter((option) => {
      const normalizedLabel = option.label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      const normalizedSublabel = option.sublabel
        ? option.sublabel
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        : ""

      return normalizedLabel.includes(normalizedSearchTerm) || normalizedSublabel.includes(normalizedSearchTerm)
    })

    setFilteredOptions(filtered)
  }, [options, searchTerm])

  // Obtener la opción seleccionada
  const selectedOption = options.find((option) => option.id === value)

  const handleSelect = (optionId: string) => {
    onChange(optionId)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchTerm("")
      }
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between",
          error ? "border-destructive text-destructive" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        )}
        onClick={handleToggle}
        disabled={disabled}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
                autoFocus
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                <p>{emptyMessage}</p>
                {createNewLink && <div className="mt-2">{createNewLink}</div>}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={cn(
                      "flex w-full items-center rounded-md px-2 py-2 text-left text-sm",
                      option.id === value ? "bg-gray-100 font-medium" : "hover:bg-gray-50",
                    )}
                    onClick={() => handleSelect(option.id)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", option.id === value ? "opacity-100" : "opacity-0")} />
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    <div>
                      <div>{option.label}</div>
                      {option.sublabel && <div className="text-xs text-gray-500">{option.sublabel}</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
