import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'orange' | 'green' | 'blue';
}

const colorClasses = {
  orange: 'bg-amber-100 text-amber-600',
  green: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
};

export function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm mb-2">{title}</p>
          <p className="text-slate-900 text-3xl">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
