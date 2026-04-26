import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-[40px] bg-red-500/20 flex items-center justify-center text-red-500 mb-8">
            <AlertTriangle className="w-12 h-12" />
          </div>
          
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4 italic">Oops! Something went wrong.</h1>
          <p className="text-white/40 max-w-md mx-auto mb-12 font-medium leading-relaxed">
            {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-black font-black text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>RELOAD APP</span>
            </button>
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-white/10 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>GO HOME</span>
            </button>
          </div>

          {isFirestoreError && (
            <div className="mt-12 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 max-w-lg mx-auto">
              <p className="text-xs text-red-400/60 font-mono leading-relaxed">
                Security Rule Violation detected. Please ensure you have the correct permissions to perform this action.
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
