import { Component, ErrorInfo, ReactNode } from "react";
import { api } from "../lib/api";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    api
      .post("/error-report", {
        message: error.message,
        stack: `${error.stack ?? ""}\n${info.componentStack ?? ""}`,
        url: window.location.href,
      })
      .catch(() => undefined);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-white font-bold text-lg">Algo deu errado nesta tela.</p>
          <p className="text-gray-500 text-sm max-w-sm">
            Já registramos o erro. Tente recarregar a página ou volte para o início.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
