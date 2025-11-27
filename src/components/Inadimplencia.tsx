import { useState } from 'react';
import { Search, Filter, Send, CheckSquare, Square, AlertCircle } from 'lucide-react';

type Tab = 'visao-geral' | 'fila-envio' | 'recuperados' | 'conferencia';

interface DebtClient {
  id: string;
  cliente: string;
  cpfCnpj: string;
  titulos: string[];
  vencimentoMaisAntigo: string;
  diasAtraso: number;
  valorTotal: number;
  statusEnvio: 'Não Enviado' | 'Em Cobrança Externa' | 'Aguardando Retorno';
  selected?: boolean;
}

const mockDebtClients: DebtClient[] = [
  {
    id: '1',
    cliente: 'João Silva',
    cpfCnpj: '123.456.789-00',
    titulos: ['T1001', 'T1002'],
    vencimentoMaisAntigo: '15/08/2024',
    diasAtraso: 98,
    valorTotal: 2450.00,
    statusEnvio: 'Não Enviado',
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    titulos: ['T1005'],
    vencimentoMaisAntigo: '22/07/2024',
    diasAtraso: 122,
    valorTotal: 3400.00,
    statusEnvio: 'Em Cobrança Externa',
  },
  {
    id: '3',
    cliente: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    titulos: ['T1009', 'T1010', 'T1011'],
    vencimentoMaisAntigo: '10/09/2024',
    diasAtraso: 72,
    valorTotal: 8750.00,
    statusEnvio: 'Não Enviado',
  },
  {
    id: '4',
    cliente: 'Pedro Costa',
    cpfCnpj: '456.789.123-00',
    titulos: ['T1015'],
    vencimentoMaisAntigo: '05/08/2024',
    diasAtraso: 108,
    valorTotal: 2100.00,
    statusEnvio: 'Aguardando Retorno',
  },
  {
    id: '5',
    cliente: 'Tech Solutions SA',
    cpfCnpj: '98.765.432/0001-10',
    titulos: ['T1020', 'T1021'],
    vencimentoMaisAntigo: '01/09/2024',
    diasAtraso: 81,
    valorTotal: 15000.00,
    statusEnvio: 'Não Enviado',
  },
  {
    id: '6',
    cliente: 'Ana Oliveira',
    cpfCnpj: '111.222.333-44',
    titulos: ['T1025'],
    vencimentoMaisAntigo: '18/10/2024',
    diasAtraso: 34,
    valorTotal: 950.00,
    statusEnvio: 'Não Enviado',
  },
];

export function Inadimplencia() {
  const [activeTab, setActiveTab] = useState<Tab>('visao-geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<DebtClient[]>(mockDebtClients);
  const [selectAll, setSelectAll] = useState(false);

  const filteredClients = clients.filter(client =>
    client.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpfCnpj.includes(searchTerm) ||
    client.titulos.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCount = clients.filter(c => c.selected).length;

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setClients(clients.map(c => ({ ...c, selected: newSelectAll })));
  };

  const handleSelectClient = (id: string) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, selected: !c.selected } : c
    ));
  };

  const handleBulkSend = () => {
    const selectedClients = clients.filter(c => c.selected);
    alert(`Enviando ${selectedClients.length} cliente(s) para cobrança externa...`);
  };

  const getAgingBadge = (dias: number) => {
    if (dias >= 90) {
      return 'bg-rose-100 text-rose-700 border-rose-300';
    } else if (dias >= 30) {
      return 'bg-amber-100 text-amber-700 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getStatusBadge = (status: DebtClient['statusEnvio']) => {
    switch (status) {
      case 'Não Enviado':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Em Cobrança Externa':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Aguardando Retorno':
        return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <div className="flex gap-1">
          {[
            { id: 'visao-geral', label: 'Visão Geral' },
            { id: 'fila-envio', label: 'Fila de Envio (CQuatro)' },
            { id: 'recuperados', label: 'Recuperados' },
            { id: 'conferencia', label: 'Conferência Manual' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Total Inadimplente</p>
          <p className="text-slate-900 text-3xl">R$ 32.7k</p>
          <p className="text-slate-500 text-xs mt-1">6 clientes</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Não Enviados</p>
          <p className="text-rose-900 text-3xl">4</p>
          <p className="text-rose-600 text-xs mt-1">Elegíveis para cobrança</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Em Cobrança</p>
          <p className="text-blue-900 text-3xl">1</p>
          <p className="text-blue-600 text-xs mt-1">Em processo externo</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Média de Atraso</p>
          <p className="text-amber-900 text-3xl">86d</p>
          <p className="text-amber-600 text-xs mt-1">Tempo médio</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, CPF/CNPJ ou título..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
          {selectedCount > 0 && (
            <button 
              onClick={handleBulkSend}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <Send size={18} />
              Enviar Selecionados ({selectedCount})
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button onClick={handleSelectAll} className="flex items-center">
                    {selectAll ? (
                      <CheckSquare size={20} className="text-blue-600" />
                    ) : (
                      <Square size={20} className="text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Cliente</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">CPF/CNPJ</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Título(s)</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Venc. Mais Antigo</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Dias em Atraso</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Valor Total</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Status de Envio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => handleSelectClient(client.id)}>
                      {client.selected ? (
                        <CheckSquare size={20} className="text-blue-600" />
                      ) : (
                        <Square size={20} className="text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{client.cliente}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{client.cpfCnpj}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.titulos.map((titulo) => (
                        <span key={titulo} className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                          {titulo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{client.vencimentoMaisAntigo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getAgingBadge(client.diasAtraso)}`}>
                      {client.diasAtraso >= 90 && <AlertCircle size={14} className="mr-1" />}
                      {client.diasAtraso} dias
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    R$ {client.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusBadge(client.statusEnvio)}`}>
                      {client.statusEnvio}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-slate-600 text-sm">
            Mostrando {filteredClients.length} de {clients.length} registros
          </p>
          {selectedCount > 0 && (
            <p className="text-blue-600 text-sm">
              {selectedCount} cliente{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
