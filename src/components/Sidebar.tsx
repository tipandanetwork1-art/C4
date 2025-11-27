import {
  Home,
  Users,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Settings,
  User,
} from "lucide-react";
import { Screen } from "@types/screens";

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "dashboard" as Screen, label: "Dashboard Estratégico", icon: Home },
    { id: "base-ativa" as Screen, label: "Base Ativa", icon: Users },
    { id: "financeiro" as Screen, label: "Financeiro", icon: DollarSign },
    {
      id: "inadimplencia" as Screen,
      label: "Inadimplência",
      icon: AlertTriangle,
    },
    { id: "relatorios" as Screen, label: "Relatórios", icon: BarChart3 },
    { id: "configuracoes" as Screen, label: "Configurações", icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      {/* Logo Branding */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                opacity="0.7"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm">SFBPanda</div>
            <div className="text-xs text-slate-400">Financeiro</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User size={20} className="text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">Admin User</div>
            <div className="text-xs text-slate-400">Financeiro Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}