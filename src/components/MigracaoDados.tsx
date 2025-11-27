import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  success: number;
  errors: number;
  messages: string[];
}

export function MigracaoDados() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    // Simular processamento (substituir por lógica real de parsing CSV/Excel)
    setTimeout(() => {
      setResult({
        success: 145,
        errors: 3,
        messages: [
          '✅ 145 títulos importados com sucesso',
          '✅ 87 clientes cadastrados',
          '⚠️ 3 registros com CPF inválido foram ignorados',
          '✅ Histórico de envios antigos preservado',
        ],
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 text-2xl">Migração de Dados Legados</h1>
        <p className="text-slate-600 text-sm mt-1">
          Importe suas planilhas antigas para o banco de dados
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet size={32} className="text-blue-600" />
          </div>
          
          <h3 className="text-slate-900 mb-2">Importar Planilha Excel/CSV</h3>
          <p className="text-slate-600 text-sm mb-4 max-w-md">
            Faça upload das suas planilhas antigas. O sistema identificará automaticamente 
            clientes, títulos, e histórico de envios.
          </p>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload size={20} />
              {isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
            </div>
          </label>
          
          <p className="text-slate-500 text-xs mt-3">
            Formatos suportados: .csv, .xlsx, .xls (máx. 10MB)
          </p>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <div>
              <p className="text-blue-900">Processando importação...</p>
              <p className="text-blue-600 text-sm">Validando dados, criando registros e cruzando informações</p>
            </div>
          </div>
        </div>
      )}

      {/* Result Summary */}
      {result && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-slate-900 mb-1">Importação Concluída</h3>
              <p className="text-slate-600 text-sm">
                {result.success} registro{result.success !== 1 ? 's' : ''} processado{result.success !== 1 ? 's' : ''} com sucesso
                {result.errors > 0 && ` • ${result.errors} erro${result.errors !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 pl-9">
            {result.messages.map((msg, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-slate-600">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Download */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-slate-600 flex-shrink-0" />
          <div>
            <h3 className="text-slate-900 mb-2">Formato da Planilha</h3>
            <p className="text-slate-600 text-sm mb-3">
              Sua planilha deve conter as seguintes colunas:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• ID Título</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• CPF/CNPJ</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• Nome Cliente</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• Valor</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• Data Vencimento</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-slate-200">
                <span className="text-slate-600">• Status</span>
              </div>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
              Baixar Planilha Modelo
              <Upload size={16} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Total de Clientes</p>
          <p className="text-slate-900 text-3xl">87</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Títulos Importados</p>
          <p className="text-slate-900 text-3xl">145</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm mb-2">Histórico Preservado</p>
          <p className="text-slate-900 text-3xl">32</p>
        </div>
      </div>
    </div>
  );
}
