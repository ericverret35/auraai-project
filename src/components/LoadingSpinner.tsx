import React from 'react';
import { Loader2, Zap, Activity, Database, FileText, ShoppingCart, Users, TrendingUp, CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'revenue' | 'success' | 'warning';
  message?: string;
  showMessage?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20'
};

const variantClasses = {
  default: 'text-cyan-400',
  revenue: 'text-emerald-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400'
};

const iconComponents = {
  default: Loader2,
  revenue: Zap,
  success: Activity,
  warning: Activity
};

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  message = '',
  showMessage = true,
  className = ''
}: LoadingSpinnerProps) {
  const Icon = iconComponents[variant];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <Icon
          className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
          strokeWidth={2.5}
        />
        {variant === 'revenue' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-2 border-emerald-400/30 rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {showMessage && message && (
        <div className="text-center">
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{message}</p>
        </div>
      )}
    </div>
  );
}

// Export specialized variants for common use cases
export const RevenueSpinner = ({ size = 'md', message = 'Génération de revenus en cours...' }: Partial<LoadingSpinnerProps>) => (
  <LoadingSpinner size={size} variant="revenue" message={message} />
);

export const SuccessSpinner = ({ size = 'md', message = 'Opération réussie' }: Partial<LoadingSpinnerProps>) => (
  <LoadingSpinner size={size} variant="success" message={message} />
);

export const WarningSpinner = ({ size = 'md', message = 'Attention requise' }: Partial<LoadingSpinnerProps>) => (
  <LoadingSpinner size={size} variant="warning" message={message} />
);

export const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <LoadingSpinner size="xl" variant="revenue" message="Synchronisation de la Flotte d'Agents..." />
  </div>
);

export const InlineLoader = ({ text = 'Chargement...' }: { text?: string }) => (
  <LoadingSpinner size="sm" variant="default" message={text} />
);

// Skeleton Loader Components
export const SkeletonCard = ({ variant = 'default' }: { variant?: 'default' | 'article' | 'product' | 'metric' }) => {
  const baseClass = 'bg-slate-900/50 border border-slate-800/50 rounded-xl animate-pulse';

  switch (variant) {
    case 'article':
      return (
        <div className={`${baseClass} p-5 space-y-4`}>
          <div className="h-4 w-3/4 bg-slate-800/50 rounded"></div>
          <div className="h-3 w-1/2 bg-slate-800/50 rounded"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/50 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-800/50 rounded"></div>
            <div className="h-3 w-1/3 bg-slate-800/50 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-800/50 rounded"></div>
            <div className="h-6 w-20 bg-slate-800/50 rounded"></div>
            <div className="h-6 w-20 bg-slate-800/50 rounded"></div>
          </div>
        </div>
      );
    case 'product':
      return (
        <div className={`${baseClass} p-5 space-y-4 flex flex-col justify-between min-h-[200px]`}>
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-slate-800/50 rounded"></div>
            <div className="h-3 w-16 bg-slate-800/50 rounded"></div>
          </div>
          <div className="h-5 w-3/4 bg-slate-800/50 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-800/50 rounded"></div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
            <div>
              <div className="h-3 w-16 bg-slate-800/50 rounded"></div>
              <div className="h-6 w-24 bg-slate-700/50 rounded mt-1"></div>
            </div>
            <div className="h-10 w-28 bg-slate-700/50 rounded"></div>
          </div>
        </div>
      );
    case 'metric':
      return (
        <div className={`${baseClass} p-5 space-y-2`}>
          <div className="h-3 w-24 bg-slate-800/50 rounded"></div>
          <div className="h-8 w-32 bg-slate-800/50 rounded"></div>
          <div className="h-2 w-20 bg-slate-800/50 rounded"></div>
        </div>
      );
    default:
      return (
        <div className={`${baseClass} p-6 space-y-4`}>
          <div className="h-4 w-1/3 bg-slate-800/50 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-800/50 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-800/50 rounded"></div>
        </div>
      );
  }
};

export const SkeletonGrid = ({
  count = 6,
  variant = 'default',
  columns = { base: 1, md: 2, lg: 3 }
}: {
  count?: number;
  variant?: 'default' | 'article' | 'product' | 'metric';
  columns?: { base: number; md: number; lg: number };
}) => (
  <div className={`grid gap-4 grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </div>
);

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function EmptyState({
  icon = <Database className="w-12 h-12 text-slate-600" />,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 bg-slate-900/30 border border-slate-800/50 rounded-2xl ${className}`}>
      <div className="mx-auto mb-4 text-slate-600">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            action.variant === 'primary'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Toast Notification Component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-950/80 border-rose-500/30 text-rose-400',
    warning: 'bg-amber-950/80 border-amber-500/30 text-amber-400',
    info: 'bg-cyan-950/80 border-cyan-500/30 text-cyan-400'
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-[100] max-w-sm p-4 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-3 ${colors[type]}`}
    >
      <div className="p-1.5 rounded-lg border">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Add missing imports for Toast
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'motion/react';