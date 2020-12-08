import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
/**
 *
 *
 * Formata a data retornada do backend para um formato válido no JS
 *
 */
export const formatAmericanDatetimeToDate = (americanDateTime: string) => {
  return new Date(americanDateTime.replace(/-/g, '/'));
};

/**
 *
 * Formata a data padrão do JS para uma data padrão no backend (se não formatar da erro de data inválida)
 *
 */
export const formatDateToAmericanDatetime = (date: Date) => {
  return format(new Date(date), 'y-MM-dd H:m', { locale: ptBR });
};
