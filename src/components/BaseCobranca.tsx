import { useState } from 'react';
import { Upload, Filter, Search } from 'lucide-react';

interface DebtEntry {
  id: string;
  titulo: string;
  cliente: string;
  cpfCnpj: string;
  valor: string;
  dataVencimento: string;
  diasAtraso: number;
  telefone: string;
}

const mockDebtData: DebtEntry[] = [
  {
    id: '1',
    titulo: 'T1001',
    cliente: 'João Silva',
    cpfCnpj: '123.456.789-00',
    valor: 'R$ 1.250,00',
    dataVencimento: '15/08/2024',
    diasAtraso: 98,
    telefone: '(11) 98765-4321',
  },
  {
    id: '2',
    titulo: 'T1002',
    cliente: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    valor: 'R$ 3.400,00',
    dataVencimento: '22/07/2024',
    diasAtraso: 122,
    telefone: '(21) 91234-5678',
  },
  {
    id: '3',
    titulo: 'T1004',
    cliente: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    valor: 'R$ 8.750,00',
    dataVencimento: '10/09/2024',
    diasAtraso: 72,
    telefone: '(11) 3456-7890',
  },
  {
    id: '4',
    titulo: 'T1006',
    cliente: 'Pedro Costa',
    cpfCnpj: '456.789.123-00',
    valor: 'R$ 2.100,00',
    dataVencimento: '05/08/2024',
    diasAtraso: 108,
    telefone: '(31) 99876-5432',
  },
  {
    id: '5',
    titulo: 'T1009',
    cliente: 'Tech Solutions SA',
    cpfCnpj: '98.765.432/0001-10',
    valor: 'R$ 15.000,00',
    dataVencimento: '01/09/2024',
    diasAtraso: 81,
    telefone: '(11) 2345-6789',
  },
];

export function BaseCobranca() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const filteredData = mockDebtData.filter(entry =>
    entry.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.cpfCnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl">Base de Cobrança</h1>
          <p className="text-slate-600 text-sm mt-1">
            Gerencie os títulos em cobrança ativa
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Upload size={18} />
            Importar CSV
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter size={18} />
            Filtrar
          </button>
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
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Vencimento</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Dias em Atraso</th>
                <th className="text-left px-6 py-3 text-slate-600 text-sm">Telefone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-slate-900">{entry.titulo}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{entry.cliente}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{entry.cpfCnpj}</td>
                  <td className="px-6 py-4 text-slate-900">{entry.valor}</td>
                  <td className="px-6 py-4 text-slate-600">{entry.dataVencimento}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      entry.diasAtraso > 90 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {entry.diasAtraso} dias
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{entry.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-slate-600 text-sm">
            Mostrando {filteredData.length} de {mockDebtData.length} registros
          </p>
        </div>
      </div>
    </div>
  );
}
