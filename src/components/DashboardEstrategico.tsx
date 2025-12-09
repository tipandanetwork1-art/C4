import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Tag,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const clientHealthData = [
  { name: 'Em Dia', value: 850, color: '#10B981' },
  { name: 'Atraso Recente', value: 120, color: '#F59E0B' },
  { name: 'Inadimplente', value: 85, color: '#E11D48' },
];

const agingData = [
  { range: '0-30 dias', valor: 15000 },
  { range: '31-60 dias', valor: 12000 },
  { range: '61-90 dias', valor: 8500 },
  { range: '+90 dias', valor: 9500 },
];

interface FluxoResumo {
  totalValor: number;
  totalRecebido: number;
  totalEmAberto: number;
  taxaAberto: number;
  periodo: {
    inicio: string;
    fim: string;
  };
  registrosConsiderados: number;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export function DashboardEstrategico() {
  const [fluxoResumo, setFluxoResumo] = useState<FluxoResumo | null>(null);
  const [fluxoLoading, setFluxoLoading] = useState(true);
  const [fluxoError, setFluxoError] = useState<string | null>(null);

  const carregarFluxoResumo = useCallback(async () => {
    try {
      setFluxoLoading(true);
      setFluxoError(null);
      const hoje = new Date();
      const params = new URLSearchParams({
        mes: String(hoje.getMonth() + 1),
        ano: String(hoje.getFullYear()),
      });
      const response = await fetch(`/api/dashboard/fluxo?${params.toString()}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Falha ao consultar API de fluxo mensal');
      }
      const data = (await response.json()) as FluxoResumo & {
        success: boolean;
        error?: string;
      };
      if (!data.success) {
        throw new Error(data.error || 'A API do IXC retornou um erro');
      }
      setFluxoResumo({
        totalValor: data.totalValor,
        totalRecebido: data.totalRecebido,
        totalEmAberto: data.totalEmAberto,
        taxaAberto: data.taxaAberto,
        periodo: data.periodo,
        registrosConsiderados: data.registrosConsiderados,
      });
    } catch (error) {
      if (error instanceof Error) {
        setFluxoError(error.message);
      } else {
        setFluxoError('Falha inesperada ao carregar o fluxo mensal.');
      }
    } finally {
      setFluxoLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarFluxoResumo();
  }, [carregarFluxoResumo]);

  const fluxoChartData = useMemo(() => {
    if (!fluxoResumo) return [];
    return [
      { categoria: 'Recebido', valor: fluxoResumo.totalRecebido, color: '#10B981' },
      { categoria: 'Em aberto', valor: fluxoResumo.totalEmAberto, color: '#E11D48' },
    ];
  }, [fluxoResumo]);

  const percentAberto = fluxoResumo
    ? Math.round(fluxoResumo.taxaAberto * 1000) / 10
    : 0;

  const periodoDescricao = fluxoResumo
    ? new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(fluxoResumo.periodo.inicio))
    : '';

  const periodoDetalhe = fluxoResumo
    ? `${new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(
        new Date(fluxoResumo.periodo.inicio)
      )} - ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(
        new Date(fluxoResumo.periodo.fim)
      )}`
    : '';

  const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">MRR</p>
              <p className="text-slate-500 text-xs">Receita Recorrente Mensal</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl mb-2">R$ 250k</p>
          <div className="flex items-center gap-1 text-emerald-600 text-sm">
            <ArrowUpRight size={16} />
            <span>+5% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">Receita Projetada</p>
              <p className="text-slate-500 text-xs">Baseada em contratos ativos</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl mb-2">R$ 260k</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm">
            <span>Projeção para Dezembro</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">Ticket Médio</p>
              <p className="text-slate-500 text-xs">Por cliente ativo</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Tag size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl mb-2">R$ 237</p>
          <div className="flex items-center gap-1 text-slate-600 text-sm">
            <span>1.055 clientes ativos</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-6 shadow-sm border-2 border-rose-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-rose-700 text-sm">Inadimplência Total</p>
              <p className="text-rose-600 text-xs">Taxa de atraso</p>
            </div>
            <div className="p-2 bg-rose-100 rounded-lg">
              <AlertTriangle size={20} className="text-rose-600" />
            </div>
          </div>
          <p className="text-rose-900 text-3xl mb-2">8.5%</p>
          <div className="flex items-center gap-1 text-rose-700 text-sm">
            <ArrowDownRight size={16} />
            <span>R$ 45k em atraso</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-slate-900 text-lg">Resumo de Receita Mensal</h3>
              <p className="text-slate-500 text-sm mt-1">
                {fluxoResumo
                  ? `Período: ${periodoDescricao} (${periodoDetalhe})`
                  : 'Aguardando atualização do mês atual'}
              </p>
            </div>
            <button
              onClick={carregarFluxoResumo}
              disabled={fluxoLoading}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {fluxoLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {fluxoError && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {fluxoError}
            </div>
          )}

          {fluxoResumo ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Soma de Valor</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {formatCurrency(fluxoResumo.totalValor)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Valor Recebido</p>
                  <p className="text-2xl font-semibold text-emerald-600 mt-2">
                    {formatCurrency(fluxoResumo.totalRecebido)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Valor em Aberto</p>
                  <p className="text-2xl font-semibold text-rose-600 mt-2">
                    {formatCurrency(fluxoResumo.totalEmAberto)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-6">
                <div className="col-span-2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fluxoChartData}
                      layout="vertical"
                      barCategoryGap={32}
                      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => currencyFormatter.format(value as number)}
                        stroke="#94A3B8"
                      />
                      <YAxis type="category" dataKey="categoria" stroke="#94A3B8" width={90} />
                      <Tooltip
                        formatter={(value: number) => currencyFormatter.format(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="valor" radius={[8, 8, 8, 8]}>
                        {fluxoChartData.map((item) => (
                          <Cell key={`bar-${item.categoria}`} fill={item.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Taxa de Aberto</p>
                    <p className="text-3xl font-semibold text-slate-900 mt-2">
                      {percentAberto.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <div className="h-3 rounded-full bg-white overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-rose-500 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, percentAberto))}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {fluxoResumo.registrosConsiderados} títulos analisados
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            !fluxoLoading &&
            !fluxoError && (
              <p className="text-sm text-slate-500">Nenhum dado retornado para este período.</p>
            )
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Saúde da Base Ativa</h3>
            <p className="text-slate-500 text-sm mt-1">Distribuição por status</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={clientHealthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {clientHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} clientes`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {clientHealthData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Curva de Inadimplência (Aging)</h3>
            <p className="text-slate-500 text-sm mt-1">Dívida agrupada por tempo de atraso</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis
                stroke="#64748B"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {agingData.map((entry, index) => (
                  <Cell
                    key={`aging-${index}`}
                    fill={index === 3 ? '#E11D48' : index === 2 ? '#F59E0B' : '#3B82F6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Atalhos Rápidos</h3>
            <p className="text-slate-500 text-sm mt-1">Ações comuns do sistema</p>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group">
              <span className="text-blue-900">Importar CSV Legado</span>
              <ArrowUpRight
                size={18}
                className="text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors group">
              <span className="text-emerald-900">Registrar Despesa Manual</span>
              <ArrowUpRight
                size={18}
                className="text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors group">
              <span className="text-rose-900">Ver Fila de Cobrança</span>
              <ArrowUpRight
                size={18}
                className="text-rose-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group">
              <span className="text-slate-900">Exportar Relatório Mensal</span>
              <ArrowUpRight
                size={18}
                className="text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
