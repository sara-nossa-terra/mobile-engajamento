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
  created_at?: Date;
  deleted_at?: Date | null;
  deleted_id?: number | null;
  updated_at?: Date;
}

export interface Leader {
  id: number;
  tx_nome: string;
  email: string;
  dt_nascimento: Date;
  nu_ddd: number;
  nu_telefone: number;
  lider_id: Leader;
  perfil: {
    id: number; 
    tx_descricao?: string;
    tx_nome: string;
  }
}

export interface PersonHelped {
  id: number;
  tx_nome: string;
  dt_nascimento: Date;
  nu_ddd: number;
  nu_telefone: number;
  lider_id: Leader;
  atividade?: { dt_dia: Date; id: number; thumbsup: boolean; tx_nome: string; reviewId: number }[];
}
