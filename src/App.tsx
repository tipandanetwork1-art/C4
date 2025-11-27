import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardEstrategico } from './components/DashboardEstrategico';
import { BaseAtiva } from './components/BaseAtiva';
import { Financeiro } from './components/Financeiro';
import { Inadimplencia } from './components/Inadimplencia';
import { Relatorios } from './components/Relatorios';
import { Configuracoes } from './components/Configuracoes';

export type Screen = 'dashboard' | 'base-ativa' | 'financeiro' | 'inadimplencia' | 'relatorios' | 'configuracoes';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeScreen={activeScreen} />
        <main className="flex-1 overflow-y-auto">
          {activeScreen === 'dashboard' && <DashboardEstrategico />}
          {activeScreen === 'base-ativa' && <BaseAtiva />}
          {activeScreen === 'financeiro' && <Financeiro />}
          {activeScreen === 'inadimplencia' && <Inadimplencia />}
          {activeScreen === 'relatorios' && <Relatorios />}
          {activeScreen === 'configuracoes' && <Configuracoes />}
        </main>
      </div>
    </div>
  );
}
