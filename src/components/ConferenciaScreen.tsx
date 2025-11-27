import { useState } from 'react';
import { Users, CheckCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { KPICard } from './KPICard';

type Status = 'DISPONÍVEL' | 'JÁ ENVIADO' | 'PAGO';

interface DebtRecord {
  titulo: string;
  cliente: string;
  status: Status;
  valor: string;
  dataVencimento: string;
}

// Mock database
const mockPaymentsDB = ['T1001', 'T1003', 'T1007', 'T1010'];
const mockSentDB = ['T1002', 'T1005', 'T1008'];

export function ConferenciaScreen() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<DebtRecord[]>([]);

  const handleProcess = () => {
    // Parse input - split by newlines and clean
    const titulos = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Cross-reference with databases
    const processed = titulos.map((titulo) => {
      let status: Status = 'DISPONÍVEL';
      
      if (mockPaymentsDB.includes(titulo)) {
        status = 'PAGO';
      } else if (mockSentDB.includes(titulo)) {
        status = 'JÁ ENVIADO';
      }

      return {
        titulo,
        cliente: `Cliente ${titulo.slice(-3)}`,
        status,
        valor: `R$ ${(Math.random() * 5000 + 500).toFixed(2)}`,
        dataVencimento: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pt-BR'),
      };
    });

    setResults(processed);
  };

  // Calculate KPIs
  const emCobranca = results.filter(r => r.status === 'DISPONÍVEL').length;
  const recuperados = results.filter(r => r.status === 'PAGO').length;
  const totalDivida = results.length;

  const getStatusBadge = (status: Status) => {
    const badges = {
      'DISPONÍVEL': 'bg-rose-100 text-rose-700 border-rose-200',
      'JÁ ENVIADO': 'bg-amber-100 text-amber-700 border-amber-200',
      'PAGO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${badges[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Em Cobrança"
          value={emCobranca}
          icon={Users}
          color="orange"
        />
        <KPICard
          title="Recuperados"
          value={recuperados}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="Total em Dívida"
          value={totalDivida}
          icon={FileSpreadsheet}
          color="blue"
        />
      </div>

      {/* Mass Input Area */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h2 className="text-slate-900 mb-4">Conferência em Massa</h2>
        <p className="text-slate-600 text-sm mb-4">
          Cole a lista de Títulos abaixo (um por linha) para verificar o status no banco de dados
        </p>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Cole a lista de Títulos aqui...&#10;Exemplo:&#10;T1001&#10;T1002&#10;T1003"
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleProcess}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Processar Verificação
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-slate-900">Resultados da Conferência</h2>
            <p className="text-slate-600 text-sm mt-1">
              {results.length} título{results.length !== 1 ? 's' : ''} processado{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Título</th>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Cliente</th>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Valor</th>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Vencimento</th>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Status</th>
                  <th className="text-left px-6 py-3 text-slate-600 text-sm">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-900">{record.titulo}</td>
                    <td className="px-6 py-4 text-slate-600">{record.cliente}</td>
                    <td className="px-6 py-4 text-slate-900">{record.valor}</td>
                    <td className="px-6 py-4 text-slate-600">{record.dataVencimento}</td>
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4">
                      {record.status === 'DISPONÍVEL' && (
                        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                          Adicionar à Fila
                          <ArrowRight size={14} />
                        </button>
                      )}
                      {record.status === 'JÁ ENVIADO' && (
                        <span className="text-slate-400 text-sm">Em processo</span>
                      )}
                      {record.status === 'PAGO' && (
                        <span className="text-emerald-600 text-sm">✓ Quitado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
