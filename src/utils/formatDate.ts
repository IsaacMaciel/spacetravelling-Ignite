import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const formatDate = (date: string): string => {
  const dateFormatted = format(new Date(date), 'dd MMM yyyy', {
    locale: ptBR,
  });
  return dateFormatted;
};

export { formatDate };
