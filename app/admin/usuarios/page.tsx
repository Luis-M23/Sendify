"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

// Server Actions
import { UsuarioMetadataService } from "@/lib/supabase/services/usuarioMetadataService";
import { RolesSistema } from "@/lib/enum";
import { UsuarioMetadata } from "@/lib/validation/usuarioMetadata";

type UserRow = {
  id: string;
  email: string;
  rol: "administrador" | "ventas" | "cliente";
  last_sign_in_at: string;
};

export default function UsersAdminPage() {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<UsuarioMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error obteniendo sesión:", error);
      } else {
        setCurrentUserId(data.session?.user.id ?? null);
      }
    };
    fetchSession();
  }, [supabase]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UsuarioMetadataService.getAll();
      setUsers(data);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error(error.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = (user: UsuarioMetadata, role: RolesSistema) => {
    toast.info(
      <div>
        <p>
          Actualizar rol de: <strong>{user.correo}</strong>
        </p>
        <p>
          Nuevo rol: <strong>{role}</strong>
        </p>
        <button
          onClick={async () => {
            try {
              await UsuarioMetadataService.updateRol(user.id_usuario, role);
              toast.success(`Rol de ${user.correo} actualizado a ${role}`);
              await loadUsers();
            } catch (error: any) {
              toast.error(error.message || "Error actualizando rol");
            }
          }}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Confirmar
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const filteredUsers = users.filter((u) =>
    u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Administra los roles y visualiza la última conexión
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario por email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No se encontraron usuarios
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-center">Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id_usuario}>
                      <TableCell>{user.correo}</TableCell>
                      <TableCell>{user.nombre_completo}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Select
                            value={user.rol}
                            onValueChange={(val) =>
                              handleRoleChange(user, val as RolesSistema)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="administrador">
                                Administrador
                              </SelectItem>
                              <SelectItem value="operador">Operador</SelectItem>
                              <SelectItem value="cliente">Cliente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
