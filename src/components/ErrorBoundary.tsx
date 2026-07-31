import { reportClientError } from "@/lib/errorReporter";
import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    reportClientError({
      message: error.message,
      stack: `${error.stack}\n\nComponent Stack:\n${errorInfo.componentStack}`,
      url: window.location.href,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <h1>Algo deu errado.</h1>
          <p>Nossa equipe já foi notificada. Tente recarregar a página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}