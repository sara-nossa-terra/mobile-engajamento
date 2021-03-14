import * as Yup from 'yup';

export const formSchemaForAdmin = Yup.object().shape({
  tx_nome: Yup.string().required(),
  nu_telefone: Yup.string().min(14).required(),
  dt_nascimento: Yup.date().required(),
  leader: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().notOneOf([0]).required(),
  }),
});

export const formSchemaForLeader = Yup.object().shape({
  tx_nome: Yup.string().required(),
  nu_telefone: Yup.string().min(14).required(),
  dt_nascimento: Yup.date().required(),
});
