import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#f4f4f4] text-[#131313]">
          <div className="w-full max-w-md p-6 bg-white border-2 border-[#2e9df7] rounded-xl shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-[#f5402c] flex items-center justify-center bg-red-50 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-5">
              The water drop game encountered a momentary glitch. Tap reload to start fresh.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffc907] hover:bg-[#ffd43b] text-[#131313] font-bold rounded-md border-2 border-[#131313] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
