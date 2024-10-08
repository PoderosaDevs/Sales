export function formatPhoneNumber(number: string): string {
  // Remove caracteres não numéricos
  const cleaned = number.replace(/\D+/g, '');
  
  // Verifica se a string possui exatamente 11 caracteres
  if (cleaned.length !== 11) {
    throw new Error('Número de telefone inválido');
  }

  // Formata o número no padrão (XX) XXXXX-XXXX
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}