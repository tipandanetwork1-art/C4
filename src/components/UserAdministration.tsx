"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  MailCheck,
  KeySquare,
  Check,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@lib/firebase";

export type Role = "admin" | "financeiro" | "visualizador";
export type Permission =
  | "dashboard"
  | "financeiro"
  | "relatorios"
  | "configuracoes"
  | "admin";

interface ManagedUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
  permissoes: Permission[];
  ultimoAcesso: string;
  photoURL?: string | null;
}

interface ApiUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
  permissions: string[];
  lastSignInTime: string | null;
}

const availablePermissions: { id: Permission; label: string }[] = [
  { id: "dashboard", label: "Dashboard Estratégico" },
  { id: "financeiro", label: "Módulo Financeiro" },
  { id: "relatorios", label: "Relatórios" },
  { id: "configuracoes", label: "Configurações" },
  { id: "admin", label: "Administração de Usuários" },
];

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  financeiro: "Financeiro",
  visualizador: "Visualizador",
};

function formatRelativeTime(date: string | null) {
  if (!date) return "Sem registro";
  const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const diff = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.round(diff / (1000 * 60));
  if (diffMinutes < 60) return formatter.format(-diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return formatter.format(-diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return formatter.format(-diffDays, "day");
}

export function UserAdministration() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Falha ao carregar usuários");
      }
      const data = (await response.json()) as { users: ApiUser[] };
      const normalized: ManagedUser[] = data.users.map((user) => ({
        id: user.uid,
        nome: user.displayName ?? user.email ?? "Usuário",
        email: user.email ?? "sem-email",
        role: (user.role as Role) ?? "visualizador",
        permissoes: (user.permissions as Permission[]) ?? [],
        ultimoAcesso: formatRelativeTime(user.lastSignInTime),
        photoURL: user.photoURL,
      }));
      setUsers(normalized);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os usuários do Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const adminCount = useMemo(
    () => users.filter((user) => user.role === "admin").length,
    [users],
  );

  const persistClaims = useCallback(
    async (uid: string, role: Role, permissions: Permission[]) => {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role, permissions }),
      });
      if (!response.ok) {
        throw new Error("Não foi possível atualizar o usuário");
      }
    },
  []);

  const handleRoleChange = async (id: string, role: Role) => {
    let permissionsSnapshot: Permission[] = [];
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          permissionsSnapshot = user.permissoes;
          return { ...user, role };
        }
        return user;
      }),
    );
    try {
      await persistClaims(id, role, permissionsSnapshot);
    } catch (err) {
      console.error(err);
      fetchUsers();
    }
  };

  const togglePermission = async (id: string, permission: Permission) => {
    let nextPermissions: Permission[] = [];
    let roleSnapshot: Role = "visualizador";

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user;
        const hasPermission = user.permissoes.includes(permission);
        nextPermissions = hasPermission
          ? user.permissoes.filter((perm) => perm !== permission)
          : [...user.permissoes, permission];
        roleSnapshot = user.role;
        return { ...user, permissoes: nextPermissions };
      }),
    );

    try {
      await persistClaims(id, roleSnapshot, nextPermissions);
    } catch (err) {
      console.error(err);
      fetchUsers();
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) return;
    setResetStatus("loading");
    setStatusMessage(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus("success");
      setStatusMessage("Email de redefinição enviado com sucesso.");
      setResetEmail("");
    } catch (err) {
      console.error(err);
      setResetStatus("error");
      setStatusMessage("Não foi possível enviar o email de redefinição.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" size={28} />
            <div>
              <p className="text-sm text-slate-500">Usuários administradores</p>
              <p className="text-2xl font-semibold text-slate-900">
                {loading ? "..." : adminCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <KeySquare className="text-emerald-600" size={28} />
            <div>
              <p className="text-sm text-slate-500">Perfis gerenciados</p>
              <p className="text-2xl font-semibold text-slate-900">
                {loading ? "..." : users.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <MailCheck className="text-blue-600" size={28} />
            <div>
              <p className="text-sm text-slate-500">Resets executados</p>
              <p className="text-2xl font-semibold text-slate-900">Automático</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Usuários e Permissões
          </h2>
          <p className="text-sm text-slate-500">
            Ajuste papéis e permissões de acesso para cada colaborador.
          </p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        {loading ? (
          <div className="p-6 flex items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin" /> Carregando usuários...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Papel
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Permissões
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Último acesso
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.nome}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-medium">
                            {user.nome[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-900 font-medium">
                            {user.nome}
                          </p>
                          <p className="text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value as Role)
                        }
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {availablePermissions.map((permission) => {
                          const active = user.permissoes.includes(
                            permission.id,
                          );
                          return (
                            <button
                              key={permission.id}
                              type="button"
                              onClick={() =>
                                togglePermission(user.id, permission.id)
                              }
                              className={`text-xs px-3 py-1 rounded-full border transition ${
                                active
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-white text-slate-500 border-slate-200"
                              }`}
                            >
                              {permission.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {user.ultimoAcesso}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Reset de senha
              </h3>
              <p className="text-sm text-slate-500">
                Envie um email de redefinição diretamente do painel.
              </p>
            </div>
            <RefreshCw size={20} className="text-slate-400" />
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              placeholder="email@empresa.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={!resetEmail || resetStatus === "loading"}
              className="w-full rounded-lg bg-indigo-600 text-white py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetStatus === "loading" ? "Enviando..." : "Enviar instruções"}
            </button>
            {statusMessage && (
              <p
                className={`text-sm flex items-center gap-2 ${
                  resetStatus === "success" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {resetStatus === "success" ? <Check size={16} /> : <X size={16} />}
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Políticas de acesso
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Ajuste rapidamente o que cada papel pode visualizar.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Administradores podem gerenciar usuários
              </span>
              <span className="text-indigo-600 font-medium">Ativado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Financeiro pode gerar relatórios
              </span>
              <span className="text-indigo-600 font-medium">Ativado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Visualizadores apenas leitura
              </span>
              <span className="text-emerald-600 font-medium">Protegido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
