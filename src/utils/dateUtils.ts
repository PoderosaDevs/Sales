export function formatDateToString(dateString: string): string {
  // Converte a string de data em um objeto Date
  const date = new Date(dateString);
  
  // Verifica se a data é inválida
  if (isNaN(date.getTime())) {
    throw new RangeError('Invalid time value');
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // Dia da semana (ex: Segunda-feira)
    day: '2-digit', // Dia do mês (ex: 01)
    month: 'long', // Nome do mês (ex: Setembro)
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  return formatter.format(date);
}

export function DateToVim(dateString: string): string {
  // Converte a string de data em um objeto Date
  const date = new Date(dateString);
  
  // Verifica se a data é inválida
  if (isNaN(date.getTime())) {
    throw new RangeError('Invalid time value');
  }

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit', // Dia do mês (ex: 01)
    month: 'long', // Nome do mês (ex: Setembro)
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  return formatter.format(date);
}
