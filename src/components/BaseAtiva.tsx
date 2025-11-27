import { useState } from 'react';
import { Search, UserPlus, Download, MoreVertical } from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  plano: string;
  valorMensal: number;
  dataContrato: string;
  status: 'Ativo' | 'Em Atraso' | 'Suspenso';
  telefone: string;
  email: string;
}

const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpfCnpj: '123.456.789-00',
    plano: 'Premium 100MB',
    valorMensal: 99.90,
    dataContrato: '15/01/2023',
    status: 'Ativo',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    plano: 'Business 500MB',
    valorMensal: 299.90,
    dataContrato: '22/03/2023',
    status: 'Em Atraso',
    telefone: '(21) 91234-5678',
    email: 'maria@empresa.com',
  },
  {
    id: '3',
    nome: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    plano: 'Corporate 1GB',
    valorMensal: 599.90,
    dataContrato: '10/06/2022',
    status: 'Ativo',
    telefone: '(11) 3456-7890',
    email: 'contato@abc.com.br',
  },
  {
    id: '4',
    nome: 'Pedro Costa',
    cpfCnpj: '456.789.123-00',
    plano: 'Standard 50MB',
    valorMensal: 49.90,
    dataContrato: '05/08/2023',
    status: 'Ativo',
    telefone: '(31) 99876-5432',
    email: 'pedro.costa@email.com',
  },
  {
    id: '5',
    nome: 'Tech Solutions SA',
    cpfCnpj: '98.765.432/0001-10',
    plano: 'Enterprise 2GB',
    valorMensal: 1299.90,
    dataContrato: '01/02/2022',
    status: 'Ativo',
    telefone: '(11) 2345-6789',
    email: 'admin@techsolutions.com',
  },
];

type StatusFilter = 'all' | 'Ativo' | 'Em Atraso' | 'Suspenso';

export function BaseAtiva() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredClientes = mockClientes.filter(cliente => {
    const matchesSearch = 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpfCnpj.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cliente.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAtivos = mockClientes.filter(c => c.status === 'Ativo').length;
  const totalEmAtraso = mockClientes.filter(c => c.status === 'Em Atraso').length;
  const mrrTotal = mockClientes.filter(c => c.status === 'Ativo').reduce((sum, c) => sum + c.valorMensal, 0);

  const getStatusBadge = (status: Cliente['status']) => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Em Atraso':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Suspenso':
        return 'bg-rose-100 text-rose-700 border-rose-300';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Total de Clientes</p>
          <p className="text-slate-900 text-3xl">{mockClientes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Clientes Ativos</p>
          <p className="text-emerald-900 text-3xl">{totalAtivos}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Em Atraso</p>
          <p className="text-amber-900 text-3xl">{totalEmAtraso}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">MRR Total</p>
          <p className="text-blue-900 text-3xl">
            R$ {(mrrTotal / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, CPF/CNPJ ou email..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Atraso">Em Atraso</option>
              <option value="Suspenso">Suspenso</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Download size={18} />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus size={18} />
              Novo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Cliente</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">CPF/CNPJ</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Plano</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Valor Mensal</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Data Contrato</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Status</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm">Contato</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-slate-900">{cliente.nome}</div>
                      <div className="text-slate-500 text-sm">{cliente.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{cliente.cpfCnpj}</td>
                  <td className="px-6 py-4 text-slate-900">{cliente.plano}</td>
                  <td className="px-6 py-4 text-slate-900">
                    R$ {cliente.valorMensal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{cliente.dataContrato}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusBadge(cliente.status)}`}>
                      {cliente.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{cliente.telefone}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-slate-600 text-sm">
            Mostrando {filteredClientes.length} de {mockClientes.length} clientes
          </p>
        </div>
      </div>
    </div>
  );
}
