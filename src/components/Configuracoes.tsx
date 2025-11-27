import { Settings, Users, Zap, Database, Shield, Bell } from 'lucide-react';

export function Configuracoes() {
  return (
    <div className="p-8 space-y-6">
      {/* Settings Categories */}
      <div className="grid grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 text-lg mb-1">Gerenciamento de Usuários</h3>
              <p className="text-slate-600 text-sm">Controle de acesso e permissões</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Usuários Ativos</p>
                <p className="text-slate-600 text-xs">Total de contas ativas</p>
              </div>
              <span className="text-blue-900 text-xl">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Permissões Configuradas</p>
                <p className="text-slate-600 text-xs">Grupos de acesso</p>
              </div>
              <span className="text-blue-900 text-xl">4</span>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Gerenciar Usuários
          </button>
        </div>

        {/* N8N Integrations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Zap size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 text-lg mb-1">Integrações n8n</h3>
              <p className="text-slate-600 text-sm">Automações e webhooks ativos</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 text-sm">Sincronização IXC</p>
                  <p className="text-slate-600 text-xs">Última execução: Hoje 08:00</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Ativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 text-sm">Webhook Cobrança</p>
                  <p className="text-slate-600 text-xs">Última execução: Hoje 06:30</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Ativo</span>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Ver Todas as Integrações
          </button>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Database size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 text-lg mb-1">Banco de Dados</h3>
              <p className="text-slate-600 text-sm">Status e manutenção</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Total de Registros</p>
                <p className="text-slate-600 text-xs">Clientes + Títulos</p>
              </div>
              <span className="text-purple-900 text-xl">1.243</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Último Backup</p>
                <p className="text-slate-600 text-xs">Backup automático</p>
              </div>
              <span className="text-emerald-600 text-sm">Hoje 03:00</span>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Configurações do Banco
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-rose-50 rounded-lg">
              <Shield size={24} className="text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 text-lg mb-1">Segurança</h3>
              <p className="text-slate-600 text-sm">Autenticação e logs</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Autenticação 2FA</p>
                <p className="text-slate-600 text-xs">Dois fatores ativo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-900 text-sm">Logs de Auditoria</p>
                <p className="text-slate-600 text-xs">Rastreamento de ações</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Ver Logs de Acesso
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-lg">
            <Settings size={24} className="text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 text-lg mb-1">Configurações Gerais</h3>
            <p className="text-slate-600 text-sm">Preferências do sistema e notificações</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-700 text-sm mb-2">Nome da Empresa</label>
            <input
              type="text"
              defaultValue="SFBPanda Telecom"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-slate-700 text-sm mb-2">CNPJ</label>
            <input
              type="text"
              defaultValue="12.345.678/0001-90"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-slate-700 text-sm mb-2">Email de Notificações</label>
            <input
              type="email"
              defaultValue="admin@sfbpanda.com.br"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-slate-700 text-sm mb-2">Fuso Horário</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>América/São_Paulo (UTC-3)</option>
              <option>América/Manaus (UTC-4)</option>
              <option>América/Rio_Branco (UTC-5)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-600" />
              <div>
                <p className="text-slate-900 text-sm">Notificações por Email</p>
                <p className="text-slate-600 text-xs">Alertas de inadimplência e atualizações</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Alterações
          </button>
          <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
