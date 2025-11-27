import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, DollarSign, Clock, Filter } from 'lucide-react';
import { IXCAPIService } from '../services/ixcAPI';
import { TituloDivida, DashboardStats } from '../types/database';

export function RadarDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [titulos, setTitulos] = useState<TituloDivida[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | '30-60' | '60-90' | '90+'>('all');

  // Sincronizar com IXC API
  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await IXCAPIService.buscarTitulosAbertos(0); // Buscar todos com atraso
      setTitulos(result);
      setLastSync(new Date());
      console.log('✅ Sincronização concluída:', result.length, 'títulos encontrados');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-sync on mount
  useEffect(() => {
    handleSync();
  }, []);

  // Calcular estatísticas
  const calcularStats = (): DashboardStats => {
    const novos7dias = titulos.filter(t => t.dias_atraso >= 30 && t.dias_atraso <= 37).length;
    const elegivel = titulos.filter(t => t.dias_atraso >= 60 && t.status_atual !== 'Enviado CQuatro').length;
    const atrasos30_60 = titulos.filter(t => t.dias_atraso >= 30 && t.dias_atraso < 60).length;
    const atrasos60_90 = titulos.filter(t => t.dias_atraso >= 60 && t.dias_atraso < 90).length;
    const atrasos90plus = titulos.filter(t => t.dias_atraso >= 90).length;
    const valorTotal = titulos.reduce((sum, t) => sum + t.valor_original, 0);

    return {
      novos_inadimplentes_7dias: novos7dias,
      carteira_elegivel_cobranca: elegivel,
      atrasos_30_60_dias: atrasos30_60,
      atrasos_60_90_dias: atrasos60_90,
      atrasos_90_plus_dias: atrasos90plus,
      valor_total_carteira: valorTotal,
    };
  };

  const stats = calcularStats();

  // Filtrar títulos por faixa de aging
  const filteredTitulos = titulos.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '30-60') return t.dias_atraso >= 30 && t.dias_atraso < 60;
    if (activeFilter === '60-90') return t.dias_atraso >= 60 && t.dias_atraso < 90;
    if (activeFilter === '90+') return t.dias_atraso >= 90;
    return true;
  });

  const getAgingColor = (dias: number) => {
    if (dias < 30) return 'text-slate-600';
    if (dias < 60) return 'text-amber-600';
    if (dias < 90) return 'text-orange-600';
    return 'text-rose-600';
  };

  const getAgingBadge = (dias: number) => {
    if (dias < 30) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (dias < 60) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (dias < 90) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header com Sincronização */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl">Radar de Inadimplência</h1>
          <p className="text-slate-600 text-sm mt-1">
            Monitoramento automático via API IXC
          </p>
          {lastSync && (
            <p className="text-slate-500 text-xs mt-1">
              Última sincronização: {lastSync.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Sincronizando...' : 'Sincronizar IXC'}
        </button>
      </div>

      {/* KPI Cards - Widgets Vivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Novos Inadimplentes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Novos Inadimplentes</p>
              <p className="text-slate-900 text-3xl">{stats.novos_inadimplentes_7dias}</p>
              <p className="text-slate-500 text-xs mt-1">Últimos 7 dias (30-37d)</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* KPI 2: Carteira Elegível para Cobrança */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg p-6 shadow-sm border-2 border-rose-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-rose-700 text-sm mb-2">🚨 Elegível para CQuatro</p>
              <p className="text-rose-900 text-3xl animate-pulse">{stats.carteira_elegivel_cobranca}</p>
              <p className="text-rose-600 text-xs mt-1">Títulos vencidos há 60+ dias</p>
            </div>
            <div className="p-3 rounded-lg bg-rose-200 text-rose-700">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* KPI 3: Valor Total em Carteira */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total em Carteira</p>
              <p className="text-slate-900 text-3xl">
                R$ {(stats.valor_total_carteira / 1000).toFixed(1)}k
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {titulos.length} título{titulos.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Aging */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-slate-600" />
          <h3 className="text-slate-900">Filtros por Envelhecimento (Aging)</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
            }`}
          >
            Todos ({titulos.length})
          </button>
          
          <button
            onClick={() => setActiveFilter('30-60')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === '30-60'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-amber-50 text-amber-700 border-amber-300 hover:border-amber-500'
            }`}
          >
            🟡 30-60 dias ({stats.atrasos_30_60_dias})
          </button>
          
          <button
            onClick={() => setActiveFilter('60-90')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === '60-90'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-orange-50 text-orange-700 border-orange-300 hover:border-orange-500'
            }`}
          >
            🟠 60-90 dias ({stats.atrasos_60_90_dias})
          </button>
          
          <button
            onClick={() => setActiveFilter('90+')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === '90+'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-300 hover:border-rose-500'
            }`}
          >
            🔴 90+ dias ({stats.atrasos_90_plus_dias})
          </button>
        </div>
      </div>

      {/* Tabela de Títulos com Filtro Ativo */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900">Títulos Monitorados</h2>
              <p className="text-slate-600 text-sm mt-1">
                {filteredTitulos.length} de {titulos.length} título{filteredTitulos.length !== 1 ? 's' : ''}
                {activeFilter !== 'all' && ` (filtro: ${activeFilter} dias)`}
              </p>
            </div>
            <Filter size={20} className="text-slate-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">ID Título</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">ID Cliente</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Valor</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Vencimento</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Dias Atraso</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Status</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Aging</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTitulos.map((titulo) => (
                <tr key={titulo.id_titulo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-mono text-sm">{titulo.id_titulo}</td>
                  <td className="px-6 py-4 text-slate-600">{titulo.id_cliente}</td>
                  <td className="px-6 py-4 text-slate-900">
                    R$ {titulo.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(titulo.data_vencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${getAgingColor(titulo.dias_atraso)}`}>
                      {titulo.dias_atraso} dias
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      titulo.status_atual === 'Em Aberto' ? 'bg-rose-100 text-rose-700' :
                      titulo.status_atual === 'Enviado CQuatro' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {titulo.status_atual}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getAgingBadge(titulo.dias_atraso)}`}>
                      {IXCAPIService.classificarPorAging(titulo.dias_atraso)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
