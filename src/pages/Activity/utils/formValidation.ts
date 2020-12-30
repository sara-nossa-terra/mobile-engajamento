import * as Yup from 'yup';

export const formSchema = Yup.object().shape({
  tx_nome: Yup.string().required(),
  dt_dia: Yup.date(),
});
