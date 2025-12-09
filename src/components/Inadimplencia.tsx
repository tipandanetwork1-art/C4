import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Filter, Send, CheckSquare, Square, AlertCircle, RefreshCw } from 'lucide-react';

type Tab = 'visao-geral' | 'fila-envio' | 'recuperados' | 'conferencia';

interface DebtClient {
  id: string;
  idCliente: string;
  cliente: string;
  razaoSocial: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  idBoleto: string;
  emissao: string;
  vencimento: string;
  descricaoCobranca: string;
  statusBoleto: string;
  diasAtraso: number;
  valorTotal: number;
  foiProtestado: string;
  contrato: string;
  statusEnvio: string;
  titulos: string[];
  selected?: boolean;
}

interface InadimplenciaResponse {
  success: boolean;
  clientes: DebtClient[];
  syncedAt?: string;
  page?: number;
  perPage?: number;
  total?: number | null;
  totalPages?: number | null;
  error?: string;
}

const REGISTROS_POR_PAGINA = 15;
const MAX_DESCRICAO_COBRANCA = 220;

export function Inadimplencia() {
  const [activeTab, setActiveTab] = useState<Tab>('visao-geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<DebtClient[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalRegistros, setTotalRegistros] = useState<number | null>(null);
  const searchRef = useRef('');
  const initialLoadRef = useRef(true);

  const fetchClientes = useCallback(
    async (pageToLoad: number = 1, searchValue?: string) => {
      try {
        setLoading(true);
        setError(null);
        setSelectAll(false);

        const params = new URLSearchParams({
          page: String(pageToLoad),
          rp: String(REGISTROS_POR_PAGINA),
        });
        const term = searchValue ?? searchRef.current;
        if (term) {
          params.set('search', term);
        }

        const response = await fetch(`/api/inadimplencia?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Falha ao consultar a API do IXC: ${response.status}`);
        }

        const data: InadimplenciaResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'A API do IXC retornou um erro inesperado');
        }

        setClients(data.clientes || []);
        setPage(data.page ?? pageToLoad);
        setTotalPages(data.totalPages ?? null);
        setTotalRegistros(
          typeof data.total === 'number' && Number.isFinite(data.total)
            ? data.total
            : null
        );
        setLastSync(data.syncedAt ? new Date(data.syncedAt) : new Date());
      } catch (err) {
        console.error('Erro ao buscar inadimplentes via IXC:', err);
        setClients([]);
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível sincronizar com a API do IXC.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    searchRef.current = searchTerm;
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      fetchClientes(1, searchTerm);
      return;
    }

    const timeout = setTimeout(() => {
      fetchClientes(1, searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchClientes]);

  const handleRefresh = () => {
    fetchClientes(1, searchRef.current);
  };

  const handlePageChange = (targetPage: number) => {
    if (loading || targetPage === page || targetPage < 1) return;
    if (totalPages && targetPage > totalPages) return;
    fetchClientes(targetPage, searchRef.current);
  };

  const selectedCount = clients.filter((c) => c.selected).length;

  const normalizeStatus = (status: string) =>
    status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const statusMatches = (status: string, keyword: string) =>
    normalizeStatus(status).includes(keyword);

  const totalInadimplente = clients.reduce((sum, c) => sum + c.valorTotal, 0);
  const naoEnviados = clients.filter((c) => statusMatches(c.statusEnvio, 'nao')).length;
  const emCobranca = clients.filter((c) => statusMatches(c.statusEnvio, 'cobranca')).length;
  const mediaAtraso =
    clients.length > 0
      ? Math.round(clients.reduce((sum, c) => sum + c.diasAtraso, 0) / clients.length)
      : 0;

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setClients(clients.map((c) => ({ ...c, selected: newSelectAll })));
  };

  const handleSelectClient = (id: string) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const handleBulkSend = () => {
    const selectedClients = clients.filter((c) => c.selected);
    alert(`Enviar ${selectedClients.length} cliente(s) para a equipe de cobrança.`);
  };

  const getAgingBadge = (dias: number) => {
    if (dias >= 90) {
      return 'bg-rose-100 text-rose-700 border-rose-300';
    } else if (dias >= 30) {
      return 'bg-amber-100 text-amber-700 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getStatusBadge = (status: string) => {
    const normalized = status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    if (normalized.includes('cobranca')) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }
    if (normalized.includes('aguardando')) {
      return 'bg-amber-100 text-amber-700 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const formatDescricaoCobranca = (descricao?: string) => {
    if (!descricao) return '-';
    const trimmed = descricao.trim();
    if (trimmed.length <= MAX_DESCRICAO_COBRANCA) {
      return trimmed;
    }
    return `${trimmed.slice(0, MAX_DESCRICAO_COBRANCA).trim()}…`;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <div className="flex gap-1">
          {[
            { id: 'visao-geral', label: 'Visão Geral' },
            { id: 'fila-envio', label: 'Fila de Envio' },
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

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <RefreshCw className="animate-spin text-blue-600" size={20} />
          <div>
            <p className="text-blue-900 font-medium">Sincronizando com IXC...</p>
            <p className="text-blue-600 text-sm">Consultando dados diretamente na API.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-amber-600" size={20} />
          <div className="flex-1">
            <p className="text-amber-900 font-medium">Falha ao sincronizar</p>
            <p className="text-amber-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            Atualizar Status
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Total Inadimplente</p>
          <p className="text-slate-900 text-3xl">R$ {(totalInadimplente / 1000).toFixed(1)}k</p>
          <p className="text-slate-500 text-xs mt-1">{clients.length} clientes nesta página</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Não Enviados</p>
          <p className="text-rose-900 text-3xl">{naoEnviados}</p>
          <p className="text-rose-600 text-xs mt-1">Aguardando ação manual</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Em Cobrança</p>
          <p className="text-blue-900 text-3xl">{emCobranca}</p>
          <p className="text-blue-600 text-xs mt-1">Processo externo</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Média de Atraso</p>
          <p className="text-amber-900 text-3xl">{mediaAtraso}d</p>
          <p className="text-amber-600 text-xs mt-1">Tempo médio</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, CPF/CNPJ ou título..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar Status
          </button>
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {selectAll ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-400" />}
            {selectAll ? 'Limpar seleção' : 'Selecionar todos'}
          </button>
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
        {lastSync && (
          <p className="text-slate-500 text-xs mt-2">
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={handleSelectAll} className="flex items-center">
                    {selectAll ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Cliente</th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Documentos</th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Contato</th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Endereço</th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Cobrança</th>
                <th className="px-4 py-3 text-left text-slate-600 text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clients.map((client) => (
                <tr key={client.id} className="align-top hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <button onClick={() => handleSelectClient(client.id)}>
                      {client.selected ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square size={18} className="text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-base font-semibold text-slate-900">{client.cliente}</p>
                    <p className="text-xs text-slate-500 mt-1">Razão Social: {client.razaoSocial || '-'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {client.titulos.map((titulo) => (
                        <span
                          key={titulo}
                          className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono"
                        >
                          {titulo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-slate-500">
                      CPF/CNPJ:{' '}
                      <span className="font-mono text-slate-900">{client.cpfCnpj}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">ID Cliente: {client.idCliente}</p>
                    <p className="text-xs text-slate-500 mt-1">Contrato: {client.contrato}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      ID Boleto: <span className="font-mono text-slate-900">{client.idBoleto}</span>
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-slate-500 truncate">
                      E-mail: <span className="text-slate-900">{client.email || '-'}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Telefone: <span className="text-slate-900">{client.telefone || '-'}</span>
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-slate-500">
                      {client.endereco}, {client.numero || 's/n'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Compl.: {client.complemento || '-'} | Bairro: {client.bairro || '-'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {client.cidade || '-'} / {client.estado || '-'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">CEP: {client.cep || '-'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-slate-500">Emissão: {client.emissao || '-'}</p>
                    <p className="text-xs text-slate-500 mt-1">Vencimento: {client.vencimento || '-'}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Valor:{' '}
                      <span className="text-slate-900 font-semibold">
                        R$ {client.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Observação:{' '}
                      <span
                        className="text-slate-900"
                        title={client.descricaoCobranca || '-'}
                      >
                        {formatDescricaoCobranca(client.descricaoCobranca)}
                      </span>
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] border ${getStatusBadge(client.statusEnvio)}`}>
                        Status Envio: {client.statusEnvio}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] border ${getStatusBadge(client.statusBoleto)}`}>
                        Status Boleto: {client.statusBoleto}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] border ${getAgingBadge(client.diasAtraso)}`}>
                        {client.diasAtraso >= 90 && <AlertCircle size={12} className="mr-1" />}
                        {client.diasAtraso} dias em atraso
                      </span>
                      <p className="text-xs text-slate-500">
                        Foi protestado: <span className="text-slate-900">{client.foiProtestado}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500 text-sm">
                    Nenhum cliente retornado pela API do IXC neste momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">
              Mostrando {clients.length} registro{clients.length === 1 ? '' : 's'} desta página
            </p>
            <p className="text-slate-500 text-xs">
              Página {page}
              {totalPages ? ` de ${totalPages}` : ''}{' '}
              {typeof totalRegistros === 'number' && `| Total retornado: ${totalRegistros}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={loading || page <= 1}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Página anterior
            </button>
            <span className="text-slate-600 text-sm">
              {page} / {totalPages ?? '?'}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={
                loading ||
                (totalPages ? page >= totalPages : clients.length < REGISTROS_POR_PAGINA)
              }
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Próxima página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

