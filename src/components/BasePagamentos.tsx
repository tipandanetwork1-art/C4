import { useState } from 'react';
import { Upload, Filter, Search, Download } from 'lucide-react';

interface PaymentEntry {
  id: string;
  titulo: string;
  cliente: string;
  cpfCnpj: string;
  valor: string;
  dataPagamento: string;
  dataVencimento: string;
  metodoPagamento: string;
}

const mockPaymentData: PaymentEntry[] = [
  {
    id: '1',
    titulo: 'T1001',
    cliente: 'Ana Oliveira',
    cpfCnpj: '111.222.333-44',
    valor: 'R$ 2.500,00',
    dataPagamento: '18/10/2024',
    dataVencimento: '15/10/2024',
    metodoPagamento: 'PIX',
  },
  {
    id: '2',
    titulo: 'T1003',
    cliente: 'Carlos Lima',
    cpfCnpj: '555.666.777-88',
    valor: 'R$ 1.800,00',
    dataPagamento: '20/10/2024',
    dataVencimento: '20/10/2024',
    metodoPagamento: 'Boleto',
  },
  {
    id: '3',
    titulo: 'T1007',
    cliente: 'Digital Corp Ltda',
    cpfCnpj: '22.333.444/0001-55',
    valor: 'R$ 12.000,00',
    dataPagamento: '05/11/2024',
    dataVencimento: '01/11/2024',
    metodoPagamento: 'Transferência',
  },
  {
    id: '4',
    titulo: 'T1010',
    cliente: 'Fernanda Souza',
    cpfCnpj: '999.888.777-66',
    valor: 'R$ 950,00',
    dataPagamento: '12/11/2024',
    dataVencimento: '10/11/2024',
    metodoPagamento: 'PIX',
  },
  {
    id: '5',
    titulo: 'T1011',
    cliente: 'Comercial XYZ SA',
    cpfCnpj: '44.555.666/0001-77',
    valor: 'R$ 7.300,00',
    dataPagamento: '15/11/2024',
    dataVencimento: '15/11/2024',
    metodoPagamento: 'Boleto',
  },
  {
    id: '6',
    titulo: 'T1012',
    cliente: 'Roberto Alves',
    cpfCnpj: '777.888.999-00',
    valor: 'R$ 3.200,00',
    dataPagamento: '18/11/2024',
    dataVencimento: '12/11/2024',
    metodoPagamento: 'Cartão de Crédito',
  },
];

export function BasePagamentos() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockPaymentData.filter(entry =>
    entry.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.cpfCnpj.includes(searchTerm)
  );

  // Calculate total
  const totalPagamentos = filteredData.reduce((acc, entry) => {
    const valor = parseFloat(entry.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + valor;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl">Base de Pagamentos</h1>
          <p className="text-slate-600 text-sm mt-1">
            Histórico de pagamentos recebidos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Upload size={18} />
            Importar CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filtrar
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Total de Pagamentos</p>
            <p className="text-slate-900 text-3xl mt-1">
              R$ {totalPagamentos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-600 text-sm">Quantidade</p>
            <p className="text-slate-900 text-2xl mt-1">{filteredData.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, cliente ou CPF/CNPJ..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Título</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Cliente</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">CPF/CNPJ</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Valor</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Data Venc.</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Data Pagto.</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Método</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((entry) => {
                const isOnTime = new Date(entry.dataPagamento.split('/').reverse().join('-')) <= 
                                 new Date(entry.dataVencimento.split('/').reverse().join('-'));
                
                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-slate-900">{entry.titulo}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-900">{entry.cliente}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{entry.cpfCnpj}</td>
                    <td className="px-6 py-4 text-slate-900">{entry.valor}</td>
                    <td className="px-6 py-4 text-slate-600">{entry.dataVencimento}</td>
                    <td className="px-6 py-4 text-slate-600">{entry.dataPagamento}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                        {entry.metodoPagamento}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        isOnTime ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isOnTime ? 'No prazo' : 'Atrasado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-slate-600 text-sm">
            Mostrando {filteredData.length} de {mockPaymentData.length} registros
          </p>
        </div>
      </div>
    </div>
  );
}
