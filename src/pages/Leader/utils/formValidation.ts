import * as Yup from 'yup';

export const formSchema = Yup.object().shape({
  tx_nome: Yup.string().required(),
  dt_nascimento: Yup.date().required(),
  nu_telefone: Yup.string().min(14).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(5).required(),
  perfil: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().oneOf([1, 2]).required(),
  }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')])
    .required(),
});

export const formSchemaUpdateLeader = Yup.object().shape({
  tx_nome: Yup.string().required(),
  dt_nascimento: Yup.date().required(),
  nu_telefone: Yup.string().min(14).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(5),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')]),
  perfil: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().oneOf([1, 2]).required(),
  }),
});
