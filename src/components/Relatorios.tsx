import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  lastGenerated: string;
  format: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    title: 'Relatório de Receitas Mensais',
    description: 'Análise completa de todas as receitas do período, incluindo MRR e projeções',
    icon: TrendingUp,
    lastGenerated: '01/11/2024',
    format: ['PDF', 'Excel', 'CSV'],
  },
  {
    id: '2',
    title: 'Base Ativa de Clientes',
    description: 'Listagem completa dos clientes ativos com dados de contrato e planos',
    icon: Users,
    lastGenerated: '15/11/2024',
    format: ['Excel', 'CSV'],
  },
  {
    id: '3',
    title: 'Fluxo de Caixa Completo',
    description: 'Receitas, despesas e saldo por categoria e período',
    icon: DollarSign,
    lastGenerated: '10/11/2024',
    format: ['PDF', 'Excel'],
  },
  {
    id: '4',
    title: 'Análise de Inadimplência',
    description: 'Aging de dívidas, taxa de recuperação e clientes em cobrança',
    icon: FileText,
    lastGenerated: '20/11/2024',
    format: ['PDF', 'Excel', 'CSV'],
  },
];

export function Relatorios() {
  return (
    <div className="p-8 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Relatórios Gerados</p>
          <p className="text-slate-900 text-3xl">24</p>
          <p className="text-slate-500 text-xs mt-1">Este mês</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Agendamentos Ativos</p>
          <p className="text-blue-900 text-3xl">8</p>
          <p className="text-blue-600 text-xs mt-1">Automáticos</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Exportações</p>
          <p className="text-slate-900 text-3xl">156</p>
          <p className="text-slate-500 text-xs mt-1">Últimos 30 dias</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Usuários Ativos</p>
          <p className="text-emerald-900 text-3xl">12</p>
          <p className="text-emerald-600 text-xs mt-1">Com acesso</p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-slate-900 text-lg">Modelos de Relatório</h3>
          <p className="text-slate-500 text-sm mt-1">Selecione um modelo para gerar ou exportar</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            
            return (
              <div key={template.id} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-slate-900 mb-1">{template.title}</h4>
                    <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        <span>Último: {template.lastGenerated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {template.format.map((format) => (
                          <button
                            key={format}
                            className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download size={16} />
                      Gerar Relatório
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-slate-900 text-lg">Relatórios Recentes</h3>
          <p className="text-slate-500 text-sm mt-1">Histórico de geração e exportação</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Relatório</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Data de Geração</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Período</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Formato</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Gerado por</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">Análise de Inadimplência</td>
                <td className="px-6 py-4 text-slate-600">20/11/2024 14:30</td>
                <td className="px-6 py-4 text-slate-600">Novembro 2024</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">PDF</span>
                </td>
                <td className="px-6 py-4 text-slate-600">Admin User</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Baixar</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">Base Ativa de Clientes</td>
                <td className="px-6 py-4 text-slate-600">15/11/2024 09:15</td>
                <td className="px-6 py-4 text-slate-600">Novembro 2024</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Excel</span>
                </td>
                <td className="px-6 py-4 text-slate-600">Admin User</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Baixar</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">Fluxo de Caixa Completo</td>
                <td className="px-6 py-4 text-slate-600">10/11/2024 16:45</td>
                <td className="px-6 py-4 text-slate-600">Outubro 2024</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">PDF</span>
                </td>
                <td className="px-6 py-4 text-slate-600">Admin User</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Baixar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-slate-900 text-lg">Relatórios Agendados</h3>
          <p className="text-slate-500 text-sm mt-1">Geração automática configurada</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-slate-900">Receitas Mensais</h4>
                <p className="text-slate-600 text-sm">Todo dia 1º do mês às 08:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Ativo</span>
              <button className="text-slate-600 hover:text-slate-900 text-sm">Editar</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-slate-900">Análise de Inadimplência</h4>
                <p className="text-slate-600 text-sm">Toda segunda-feira às 10:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Ativo</span>
              <button className="text-slate-600 hover:text-slate-900 text-sm">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
