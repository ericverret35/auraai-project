import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: null };
  
  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    (this as any).setState({ error, errorInfo });
    console.error('🚨 [ErrorBoundary] Erreur capturée:', error, errorInfo);
    
    // Log to platform state if available
    try {
      if ((window as any).aura_auth_token) {
        fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(window as any).aura_auth_token}`
          },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
          })
        }).catch(() => {});
      }
    } catch (e) {}
  }

  public render() {
    if (this.state.hasError) {
      if ((this as any).props.fallback) {
        return (this as any).props.fallback;
      }
      return this.renderDefaultFallback();
    }
    return (this as any).props.children;
  }

  private renderDefaultFallback() {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-red-900/50 rounded-2xl p-6 space-y-6 shadow-2xl shadow-red-500/5">
          <div className="space-y-3.5 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-red-500/15">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
                Erreur d'Application Détectée
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">
                L'ErrorBoundary Aura a intercepté une erreur critique
              </p>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              Détails Techniques
            </h3>
            {this.state.error && (
              <pre className="text-[10px] text-red-300 bg-red-950/50 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
                {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            )}
            {this.state.errorInfo && (
              <details className="text-[10px] text-zinc-400">
                <summary className="cursor-pointer font-mono text-red-400">Stack des Composants (Cliquer pour afficher)</summary>
                <pre className="mt-2 p-3 bg-zinc-950 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                (this as any).setState({ hasError: false, error: null, errorInfo: null });
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-emerald-550/10 active:scale-[0.98] transition font-mono flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer (Reset ErrorBoundary)
            </button>
            <a
              href="/"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-cyan-550/10 active:scale-[0.98] transition font-mono flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Retour à l'Accueil
            </a>
          </div>

          <div className="pt-4 border-t border-red-900/30 text-center space-y-1 text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
            <p className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <span>🛡️ Protégé par ErrorBoundary Aura v2.4</span>
            </p>
            <p>L'application continue de fonctionner - Seule la section concernée est isolée</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;