'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, MoreVertical, RefreshCw, Search, UserPlus } from 'lucide-react';

import { supabase } from '../services/supabase';

interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  plano: string;
  valorMensal: number;
  dataContrato: string;
  status: 'Ativo' | 'Em Atraso' | 'Suspenso' | string;
  telefone: string;
  email: string;
}

interface RawCliente {
  id?: string | number;
  nome?: string;
  cpf_cnpj?: string;
  plano?: string;
  valor_mensal?: number | string;
  data_contrato?: string;
  status?: string;
  telefone?: string;
  email?: string;
}

type StatusFilter = 'all' | 'Ativo' | 'Em Atraso' | 'Suspenso';

const formatCliente = (row: RawCliente): Cliente => {
  const fallbackId = `${row.id ?? row.cpf_cnpj ?? row.email ?? `${Date.now()}-${Math.random()}`}`;
  const valor = Number(row.valor_mensal ?? 0);
  const valorMensal = Number.isFinite(valor) ? valor : 0;

  return {
    id: String(fallbackId),
    nome: row.nome ?? '',
    cpfCnpj: row.cpf_cnpj ?? '',
    plano: row.plano ?? '',
    valorMensal,
    dataContrato: row.data_contrato ? new Date(row.data_contrato).toLocaleDateString('pt-BR') : '-',
    status: row.status ?? 'Ativo',
    telefone: row.telefone ?? '',
    email: row.email ?? '',
  };
};

export function BaseAtiva() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      setClientes([]);
      setLoading(false);
      return;
    }

    const dadosFormatados: Cliente[] = (data as RawCliente[] | null)?.map((row) => formatCliente(row)) ?? [];
    setClientes(dadosFormatados);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleReload = () => {
    fetchClientes();
  };

  const filteredClientes = clientes.filter((cliente) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (cliente.nome?.toLowerCase() ?? '').includes(search) ||
      (cliente.cpfCnpj ?? '').includes(searchTerm) ||
      (cliente.email?.toLowerCase() ?? '').includes(search);

    const matchesStatus = statusFilter === 'all' || cliente.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAtivos = clientes.filter((c) => c.status === 'Ativo').length;
  const totalEmAtraso = clientes.filter((c) => c.status === 'Em Atraso').length;
  const mrrTotal = clientes.filter((c) => c.status === 'Ativo').reduce((sum, c) => sum + (c.valorMensal || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Em Atraso':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Suspenso':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Base Ativa</h1>
        <button
          onClick={handleReload}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex gap-2 items-center text-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Atualizar Dados
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Total de Clientes</p>
          <p className="text-slate-900 text-3xl font-bold">{clientes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Clientes Ativos</p>
          <p className="text-emerald-600 text-3xl font-bold">{totalAtivos}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Em Atraso</p>
          <p className="text-amber-600 text-3xl font-bold">{totalEmAtraso}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">MRR Total (Ativos)</p>
          <p className="text-blue-600 text-3xl font-bold">R$ {(mrrTotal / 1000).toFixed(1)}k</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full">
            <div className="flex-1 relative w-full">
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
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value="all">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Atraso">Em Atraso</option>
              <option value="Suspenso">Suspenso</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors w-full md:w-auto">
              <Download size={18} />
              Exportar
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
              <UserPlus size={18} />
              Novo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Cliente</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">CPF/CNPJ</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Plano</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Valor Mensal</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Data Contrato</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold">Contato</th>
                <th className="text-left px-6 py-4 text-slate-600 text-sm font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <RefreshCw className="animate-spin text-blue-500" />
                    </div>
                    Carregando dados do sistema...
                  </td>
                </tr>
              )}

              {!loading && filteredClientes.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Nenhum cliente encontrado. Importe o CSV no Supabase ou adicione um novo.
                  </td>
                </tr>
              )}

              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-slate-900 font-medium">{cliente.nome || 'Cliente sem nome'}</div>
                      <div className="text-slate-500 text-xs">{cliente.email || 'sem email'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{cliente.cpfCnpj || '-'}</td>
                  <td className="px-6 py-4 text-slate-900 text-sm">{cliente.plano || '-'}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold text-sm">
                    {cliente.valorMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{cliente.dataContrato}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(cliente.status)}`}>
                      {cliente.status || 'Desconhecido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{cliente.telefone || '-'}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-blue-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-slate-600 text-sm">
            Mostrando {filteredClientes.length} de {clientes.length} clientes
          </p>
        </div>
      </div>
    </div>
  );
}
