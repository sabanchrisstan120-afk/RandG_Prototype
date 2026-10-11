import type { ServiceStatus } from '../../types';
import { Clock, PlayCircle, CheckCircle2, PauseCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ServiceStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const configMap: Record<ServiceStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    'Assigned': {
      bg: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    },
    'In Progress': {
      bg: 'bg-amber-50 text-amber-800',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <PlayCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    },
    'Completed': {
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    },
    'On Hold': {
      bg: 'bg-orange-50 text-orange-700',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: <PauseCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    },
    'Cancelled': {
      bg: 'bg-rose-50 text-rose-700',
      border: 'border-rose-200',
      text: 'text-rose-700',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    }
  };

  const current = configMap[status] || configMap['Assigned'];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.border} ${current.bg} ${sizeClasses} shadow-xs font-medium tracking-tight`}
    >
      {showIcon && current.icon}
      <span>{status}</span>
    </span>
  );
};
