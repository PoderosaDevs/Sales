const RAW_API_URL = import.meta.env.VITE_PODEROSA_API_URL || "http://localhost:4000/graphql";
const API_URL = RAW_API_URL.replace(/\/graphql\/?$/, "");

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
    console.error("Falha ao reportar erro pro backend");
  });
}