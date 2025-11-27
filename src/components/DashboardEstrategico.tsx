import { TrendingUp, Calendar, Tag, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const revenueData = [
  { month: 'Jul', real: 210000, projetado: 220000 },
  { month: 'Ago', real: 225000, projetado: 230000 },
  { month: 'Set', real: 235000, projetado: 240000 },
  { month: 'Out', real: 242000, projetado: 245000 },
  { month: 'Nov', real: 250000, projetado: 255000 },
  { month: 'Dez', real: null, projetado: 260000 },
];

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

export function DashboardEstrategico() {
  return (
    <div className="p-8 space-y-6">
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* MRR */}
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

        {/* Receita Projetada */}
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

        {/* Ticket Médio */}
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

        {/* Inadimplência */}
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

      {/* Middle Row: Main Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart - 2/3 width */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Fluxo de Receita Real vs. Projetado</h3>
            <p className="text-slate-500 text-sm mt-1">Últimos 6 meses</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="real" stroke="#10B981" strokeWidth={3} name="Receita Real" dot={{ fill: '#10B981', r: 5 }} />
              <Line type="monotone" dataKey="projetado" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" name="Receita Projetada" dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client Health Donut - 1/3 width */}
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
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Operational Snapshots */}
      <div className="grid grid-cols-2 gap-6">
        {/* Aging Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Curva de Inadimplência (Aging)</h3>
            <p className="text-slate-500 text-sm mt-1">Dívida agrupada por tempo de atraso</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {agingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#E11D48' : index === 2 ? '#F59E0B' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Atalhos Rápidos</h3>
            <p className="text-slate-500 text-sm mt-1">Ações comuns do sistema</p>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group">
              <span className="text-blue-900">Importar CSV Legado</span>
              <ArrowUpRight size={18} className="text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors group">
              <span className="text-emerald-900">Registrar Despesa Manual</span>
              <ArrowUpRight size={18} className="text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors group">
              <span className="text-rose-900">Ver Fila de Cobrança</span>
              <ArrowUpRight size={18} className="text-rose-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group">
              <span className="text-slate-900">Exportar Relatório Mensal</span>
              <ArrowUpRight size={18} className="text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
