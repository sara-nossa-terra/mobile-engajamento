export enum AppColors {
  RED = '#F2545B',
  GREEN = '#82B865',
  BLUE = '#3B8EA5',
  YELLOW = '#FEAD34',
  BLACK = '#27242E',
  OPTION_DISABLE = '#D9D9D9',
  INPUT_DISABLE = '#DFDFDF',
}

export interface User {
  id: number;
  name: string;
  email: string;
  birth: Date;
}

export interface Activity {
  id: number;
  tx_nome: string;
  dt_dia: string;
}

export interface Leader {
  id: number;
  tx_nome: string;
  email: string;
  dt_nascimento: Date;
  nu_ddd: number;
  nu_telefone: number;
  lider_id: Leader;
}

export interface PersonHelped {
  id: number;
  tx_nome: string;
  dt_nascimento: Date;
  nu_ddd: number;
  nu_telefone: number;
  lider_id: Leader;
  thumbsup?: boolean;
}

export interface LifeReview {}
