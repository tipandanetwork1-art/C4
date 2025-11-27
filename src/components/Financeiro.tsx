import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const cashflowData = [
  { mes: 'Jan', receitas: 245000, despesas: 180000 },
  { mes: 'Fev', receitas: 250000, despesas: 175000 },
  { mes: 'Mar', receitas: 238000, despesas: 185000 },
  { mes: 'Abr', receitas: 255000, despesas: 190000 },
  { mes: 'Mai', receitas: 262000, despesas: 188000 },
  { mes: 'Jun', receitas: 270000, despesas: 195000 },
];

const categoriesData = [
  { categoria: 'Infraestrutura', valor: 85000 },
  { categoria: 'Pessoal', valor: 120000 },
  { categoria: 'Marketing', valor: 35000 },
  { categoria: 'Operacional', valor: 45000 },
  { categoria: 'Administrativo', valor: 28000 },
];

export function Financeiro() {
  const receitasTotal = cashflowData[cashflowData.length - 1].receitas;
  const despesasTotal = cashflowData[cashflowData.length - 1].despesas;
  const lucroLiquido = receitasTotal - despesasTotal;
  const margemLucro = ((lucroLiquido / receitasTotal) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">Receitas do Mês</p>
              <p className="text-slate-500 text-xs">Junho 2024</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl">R$ 270k</p>
          <p className="text-emerald-600 text-sm mt-2">+2.8% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">Despesas do Mês</p>
              <p className="text-slate-500 text-xs">Junho 2024</p>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <TrendingDown size={20} className="text-rose-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl">R$ 195k</p>
          <p className="text-rose-600 text-sm mt-2">+3.7% vs mês anterior</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-blue-700 text-sm">Lucro Líquido</p>
              <p className="text-blue-600 text-xs">Junho 2024</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <DollarSign size={20} className="text-blue-700" />
            </div>
          </div>
          <p className="text-blue-900 text-3xl">R$ 75k</p>
          <p className="text-blue-700 text-sm mt-2">Margem: {margemLucro}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-slate-600 text-sm">Fluxo de Caixa</p>
              <p className="text-slate-500 text-xs">Saldo disponível</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <CreditCard size={20} className="text-slate-600" />
            </div>
          </div>
          <p className="text-slate-900 text-3xl">R$ 125k</p>
          <p className="text-slate-600 text-sm mt-2">Capital de giro</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Cashflow Chart */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Fluxo de Caixa</h3>
            <p className="text-slate-500 text-sm mt-1">Receitas vs Despesas (últimos 6 meses)</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#10B981" name="Receitas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesas" fill="#E11D48" name="Despesas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-slate-900 text-lg">Despesas por Categoria</h3>
            <p className="text-slate-500 text-sm mt-1">Distribuição de gastos</p>
          </div>
          <div className="space-y-4">
            {categoriesData.map((cat) => {
              const total = categoriesData.reduce((sum, c) => sum + c.valor, 0);
              const percentage = ((cat.valor / total) * 100).toFixed(1);
              
              return (
                <div key={cat.categoria}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">{cat.categoria}</span>
                    <span className="text-slate-900">R$ {(cat.valor / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{percentage}% do total</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-slate-900 text-lg">Transações Recentes</h3>
          <p className="text-slate-500 text-sm mt-1">Últimas movimentações financeiras</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Data</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Descrição</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Categoria</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Tipo</th>
                <th className="text-right px-6 py-4 text-slate-600 text-sm">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">15/11/2024</td>
                <td className="px-6 py-4 text-slate-900">Pagamento Mensalidade - Cliente XYZ</td>
                <td className="px-6 py-4 text-slate-600">Receita Recorrente</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Receita</span>
                </td>
                <td className="px-6 py-4 text-right text-emerald-700">+ R$ 599,90</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">14/11/2024</td>
                <td className="px-6 py-4 text-slate-900">Servidor AWS - Custo Mensal</td>
                <td className="px-6 py-4 text-slate-600">Infraestrutura</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs">Despesa</span>
                </td>
                <td className="px-6 py-4 text-right text-rose-700">- R$ 12.450,00</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">13/11/2024</td>
                <td className="px-6 py-4 text-slate-900">Folha de Pagamento</td>
                <td className="px-6 py-4 text-slate-600">Pessoal</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs">Despesa</span>
                </td>
                <td className="px-6 py-4 text-right text-rose-700">- R$ 120.000,00</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">12/11/2024</td>
                <td className="px-6 py-4 text-slate-900">Campanha Google Ads</td>
                <td className="px-6 py-4 text-slate-600">Marketing</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs">Despesa</span>
                </td>
                <td className="px-6 py-4 text-right text-rose-700">- R$ 8.500,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
