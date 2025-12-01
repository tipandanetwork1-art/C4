"use client";

import { ThemeToggle } from "@components/ThemeToggle";
import { CalendarDays, RefreshCw } from "lucide-react";
import { Screen } from "@types/screens";

interface HeaderProps {
  activeScreen: Screen;
}

const screenTitles: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Visão Geral Financeira",
    subtitle: "Última sincronização: Hoje às 08:00 (via n8n)",
  },
  "base-ativa": {
    title: "Base Ativa de Clientes",
    subtitle: "Gerenciamento completo da carteira de clientes",
  },
  financeiro: {
    title: "Gestão Financeira",
    subtitle: "Fluxo de caixa, receitas e despesas",
  },
  inadimplencia: {
    title: "Gestão de Inadimplência & Cobrança",
    subtitle: "Controle de atrasos e envio para cobrança",
  },
  relatorios: {
    title: "Relatórios & Analytics",
    subtitle: "Exportação e análise de dados",
  },
  configuracoes: {
    title: "Configurações do Sistema",
    subtitle: "Usuários, integrações e preferências",
  },
  "admin-usuarios": {
    title: "Administração de Usuários",
    subtitle: "Controle de permissões e segurança",
  },
  perfil: {
    title: "Meu Perfil",
    subtitle: "Atualize seus dados pessoais e credenciais",
  },
};

export function Header({ activeScreen }: HeaderProps) {
  const { title, subtitle } = screenTitles[activeScreen];

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800">
            <CalendarDays size={18} className="text-slate-600 dark:text-slate-200" />
            <span className="text-slate-700 text-sm dark:text-slate-200">Este mês</span>
          </button>

          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800">
            <RefreshCw size={18} className="text-slate-600 dark:text-slate-200" />
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
