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
  name: string;
  day: Date;
}

export interface Leader {
  id: number;
  name: string;
  phone: string;
  email: string;
  birth: Date;
}

export interface PersonHelped {
  id: number;
  name: string;
  phone: string;
  birth: Date;
  leaderId: number;
}

export interface LifeReview {}
