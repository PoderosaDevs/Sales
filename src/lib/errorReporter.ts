const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface ClientErrorPayload {
  message: string;
  stack?: string;
  url: string;
}

export function reportClientError(payload: ClientErrorPayload): void {
  fetch(`${API_URL}/error-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // se falhar o próprio report, só loga no console, não quebra nada
    console.error("Falha ao reportar erro pro backend");
  });
}