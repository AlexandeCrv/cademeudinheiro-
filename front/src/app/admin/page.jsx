"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useToast } from "../../../hooks/use-toast";
import Sidebar from "../dashboard/sidebar";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao verificar autenticação");
        }

        const data = await response.json();

        if (data.currentUser) {
          setUserName(data.currentUser.name || "Usuário");
          setUserRole(data.currentUser.role || "");
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const [overviewResponse, meResponse] = await Promise.all([
          fetch(`${BASE_URL}/admin/overview`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!overviewResponse.ok || !meResponse.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const overviewData = await overviewResponse.json();
        const currentUser = await meResponse.json();

        const filteredUsers = overviewData.users.filter(
          (user) => user._id !== currentUser._id && user.role !== "admin"
        );

        setOverview(overviewData);
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: error.message || "Falha ao carregar dados do dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    fetchAdminData();
  }, [router, toast]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }

    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBlockUser = async (userId, isBlocked) => {
    setActionLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = isBlocked
      ? `${BASE_URL}/auth/users/${userId}/unblock`
      : `${BASE_URL}/auth/users/${userId}/block`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, isBlocked: !isBlocked } : user
      )
    );

    toast({
      title: "Sucesso",
      description: data.message,
    });

    setActionLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(`${BASE_URL}/auth/users/${userToDelete._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    setUsers(users.filter((user) => user._id !== userToDelete._id));

    if (overview) {
      setOverview({
        ...overview,
        totalUsers: overview.totalUsers - 1,
        onlineUsers: userToDelete.isOnline
          ? overview.onlineUsers - 1
          : overview.onlineUsers,
      });
    }

    toast({
      title: "Sucesso",
      description: data.message,
    });

    setActionLoading(false);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-950">
        <div className="flex flex-1">
          <Sidebar userName={userName} role={userRole} onLogout={handleLogout} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="text-purple-300">Carregando dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-clip overflow-x-clip relative bg-gray-950">
      <div className="flex w-full relative">
        <div className="w-64 flex-shrink-0 relative">
          <Sidebar userName={userName} role={userRole} onLogout={handleLogout} />
        </div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>
        </div>
        <main className="flex-1 p-4 relative z-10 md:p-8 overflow-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Dashboard de Administração
              </h1>
              <p className="text-purple-300">
                Gerencie usuários, visualize estatísticas e monitore atividades.
              </p>
            </div>

            {overview && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:bg-gray-900/80 transition-colors group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-200">
                      Total de Usuários
                    </CardTitle>
                    <Users className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {overview.totalUsers}
                    </div>
                    <p className="text-xs text-purple-300/70">
                      Usuários cadastrados no sistema
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:bg-gray-900/80 transition-colors group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-200">
                      Usuários Online
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {overview.onlineUsers}
                    </div>
                    <p className="text-xs text-purple-300/70">
                      Usuários ativos no momento
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:bg-gray-900/80 transition-colors group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-200">
                      Transações
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors"
                    >
                      <path d="M16 6h6"></path>
                      <path d="M21 12H8"></path>
                      <path d="M3 18h7"></path>
                      <path d="M16 6l-4 6 4 6"></path>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {overview.totalTransactions}
                    </div>
                    <p className="text-xs text-purple-300/70">
                      Total de transações registradas
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:bg-gray-900/80 transition-colors group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-200">
                      Metas
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors"
                    >
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {overview.totalGoals}
                    </div>
                    <p className="text-xs text-purple-300/70">
                      Metas financeiras criadas
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList className="bg-gray-800/60 backdrop-blur-sm">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-purple-900 data-[state=active]:text-white text-purple-200"
                  >
                    Todos os Usuários
                  </TabsTrigger>
                  <TabsTrigger
                    value="online"
                    className="data-[state=active]:bg-purple-900 data-[state=active]:text-white text-purple-200"
                  >
                    Online
                  </TabsTrigger>
                  <TabsTrigger
                    value="blocked"
                    className="data-[state=active]:bg-purple-900 data-[state=active]:text-white text-purple-200"
                  >
                    Bloqueados
                  </TabsTrigger>
                </TabsList>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-400" />
                  <Input
                    type="search"
                    placeholder="Buscar usuários..."
                    className="w-full sm:w-[250px] pl-8 bg-gray-800/60 border-gray-700 text-white placeholder:text-purple-300/70 focus-visible:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <UsersTable
                  users={filteredUsers}
                  onBlockUser={handleBlockUser}
                  onDeleteUser={(user) => {
                    setUserToDelete(user);
                    setDeleteDialogOpen(true);
                  }}
                  actionLoading={actionLoading}
                />
              </TabsContent>

              <TabsContent value="online" className="mt-0">
                <UsersTable
                  users={filteredUsers.filter((user) => user.isOnline)}
                  onBlockUser={handleBlockUser}
                  onDeleteUser={(user) => {
                    setUserToDelete(user);
                    setDeleteDialogOpen(true);
                  }}
                  actionLoading={actionLoading}
                />
              </TabsContent>

              <TabsContent value="blocked" className="mt-0">
                <UsersTable
                  users={filteredUsers.filter((user) => user.isBlocked)}
                  onBlockUser={handleBlockUser}
                  onDeleteUser={(user) => {
                    setUserToDelete(user);
                    setDeleteDialogOpen(true);
                  }}
                  actionLoading={actionLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-purple-300">
              Você está prestes a excluir permanentemente a conta de {userToDelete?.name}.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive" className="border-red-900 bg-red-950/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Todos os dados associados a este usuário serão excluídos permanentemente.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
              className="border-gray-700 text-purple-200 hover:bg-gray-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-red-700 hover:bg-red-600"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Conta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsersTable({ users, onBlockUser, onDeleteUser, actionLoading }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Users className="h-10 w-10 text-purple-400 mb-4" />
        <h3 className="text-lg font-medium text-white">Nenhum usuário encontrado</h3>
        <p className="text-purple-300 mt-1">
          Não há usuários que correspondam aos critérios de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-900/80">
          <TableRow className="border-gray-800 hover:bg-gray-800/50">
            <TableHead className="text-purple-200">Nome</TableHead>
            <TableHead className="text-purple-200">Email</TableHead>
            <TableHead className="hidden md:table-cell text-purple-200">Status</TableHead>
            <TableHead className="hidden md:table-cell text-purple-200">Função</TableHead>
            <TableHead className="text-right text-purple-200">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} className="border-gray-800 hover:bg-gray-800/50">
              <TableCell className="font-medium flex items-center gap-2 text-white">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto || "/placeholder.svg"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center ring-2 ring-purple-500/20">
                    <span className="text-xs font-medium text-purple-200">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span>{user.name}</span>
                {user.isOnline && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </TableCell>
              <TableCell className="text-purple-200">{user.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {user.isBlocked ? (
                  <Badge
                    variant="destructive"
                    className="bg-red-900/60 text-red-200 hover:bg-red-800"
                  >
                    Bloqueado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-700 text-green-400 bg-green-900/20"
                  >
                    Ativo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.role === "admin" ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 w-fit bg-purple-900/60 text-purple-200 hover:bg-purple-800"
                  >
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="w-fit border-gray-700 text-gray-300"
                  >
                    Usuário
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant={user.isBlocked ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => onBlockUser(user._id, user.isBlocked)}
                    disabled={actionLoading || user.role === "admin"}
                    title={
                      user.role === "admin"
                        ? "Não é possível bloquear administradores"
                        : ""
                    }
                    className={
                      user.isBlocked
                        ? "border-green-700 text-green-400 hover:bg-green-900/30 hover:text-green-300"
                        : "bg-purple-900/60 text-purple-200 hover:bg-purple-800 hover:text-white"
                    }
                  >
                    {user.isBlocked ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Desbloquear</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Bloquear</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    disabled={actionLoading || user.role === "admin"}
                    title={
                      user.role === "admin"
                        ? "Não é possível excluir administradores"
                        : ""
                    }
                    className="bg-red-900/60 text-red-200 hover:bg-red-800 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
