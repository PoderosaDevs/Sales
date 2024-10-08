export function formatCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D+/g, '');
  
  // Verifica se a string possui exatamente 11 caracteres
  if (cleaned.length !== 11) {
    throw new Error('Número de CPF inválido');
  }
  
  // Formata o CPF no padrão XXX.XXX.XXX-XX
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
