"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Search, MapPin, DollarSign, FileText } from "lucide-react"
import { CountryModal } from "@/components/admin-modals-extended"
import { CountriesService } from "@/lib/services/countriesService"
import { Country, CreateCountry, UpdateCountry } from "@/lib/validation/countries"

export default function CountriesAdminPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null)

  const loadCountries = async () => {
    try {
      setLoading(true)
      const data = await CountriesService.getAll()
      setCountries(data)
    } catch (error) {
      console.error("Error loading countries:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCountries()
  }, [])

  const filteredCountries = countries.filter(country =>
    country.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCountry = () => {
    setModalMode("add")
    setSelectedCountry(null)
    setModalOpen(true)
  }

  const handleEditCountry = (country: Country) => {
    setModalMode("edit")
    setSelectedCountry(country)
    setModalOpen(true)
  }

  const handleDeleteCountry = (country: Country) => {
    setCountryToDelete(country)
    setDeleteDialogOpen(true)
  }

  const handleModalSubmit = async (data: CreateCountry | UpdateCountry) => {
    try {
      if (modalMode === "add") {
        await CountriesService.create(data as CreateCountry)
      } else {
        await CountriesService.update(selectedCountry!.id!, data as UpdateCountry)
      }
      await loadCountries()
    } catch (error) {
      console.error("Error saving country:", error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (countryToDelete) {
      try {
        await CountriesService.delete(countryToDelete.id!)
        await loadCountries()
      } catch (error) {
        console.error("Error deleting country:", error)
      }
    }
    setDeleteDialogOpen(false)
    setCountryToDelete(null)
  }

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      "América del Norte": "bg-blue-100 text-blue-800 border-blue-200",
      "América Central": "bg-green-100 text-green-800 border-green-200",
      "América del Sur": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Europa": "bg-purple-100 text-purple-800 border-purple-200",
      "Asia": "bg-red-100 text-red-800 border-red-200",
      "África": "bg-orange-100 text-orange-800 border-orange-200",
      "Oceanía": "bg-teal-100 text-teal-800 border-teal-200",
    }
    return colors[region] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Países</h1>
          <p className="text-muted-foreground">Administra los países disponibles para envíos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Países</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Con Aduana</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {countries.filter(c => c.restricciones?.aduana).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Regiones</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(countries.map(c => c.region)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monedas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(countries.map(c => c.moneda)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Países Disponibles</CardTitle>
                <CardDescription>Gestiona los países y sus configuraciones de aduana</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar países..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button onClick={handleAddCountry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo País
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Cargando países...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Región</TableHead>
                    <TableHead>Moneda</TableHead>
                    <TableHead>Aduana</TableHead>
                    <TableHead>Impuestos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {country.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{country.nombre}</TableCell>
                      <TableCell>
                        <Badge className={getRegionColor(country.region)}>
                          {country.region}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {country.moneda}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {country.restricciones?.aduana ? (
                          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                            Requerida
                          </Badge>
                        ) : (
                          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                            No Requerida
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {country.restricciones?.impuestos ? (
                          <span className="font-medium">{country.restricciones.impuestos}%</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCountry(country)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCountry(country)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <CountryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedCountry || undefined}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar País</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el país "{countryToDelete?.nombre}"? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
