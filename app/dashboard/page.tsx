"use client";

import "./dashboard.css";

import { useState, type ComponentType } from "react";
import { Sidebar } from "@components/Sidebar";
import { Header } from "@components/Header";
import { DashboardEstrategico } from "@components/DashboardEstrategico";

// CORREÇÃO 1: Importação padrão (sem chaves) pois usamos 'export default' no arquivo original
import BaseAtiva from "@components/BaseAtiva";

import { Financeiro } from "@components/Financeiro";
import { Inadimplencia } from "@components/Inadimplencia";
import { Relatorios } from "@components/Relatorios";
import { Configuracoes } from "@components/Configuracoes";

// CORREÇÃO 2: Definimos o tipo Screen aqui para evitar erro de importação
export type Screen = 
  | "dashboard" 
  | "base-ativa" 
  | "financeiro" 
  | "inadimplencia" 
  | "relatorios" 
  | "configuracoes";

const screenComponents: Record<Screen, ComponentType> = {
  dashboard: DashboardEstrategico,
  "base-ativa": BaseAtiva,
  financeiro: Financeiro,
  inadimplencia: Inadimplencia,
  relatorios: Relatorios,
  configuracoes: Configuracoes,
};

export default function DashboardPage() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  
  // Componente dinâmico com base na tela ativa
  const ActiveScreen = screenComponents[activeScreen];

  return (
    <div className="dashboard-page flex h-screen bg-slate-50">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeScreen={activeScreen} />
        <main className="flex-1 overflow-y-auto">
          <ActiveScreen />
        </main>
      </div>
    </div>
  );
}