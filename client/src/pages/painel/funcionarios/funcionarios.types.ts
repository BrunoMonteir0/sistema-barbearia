export type WeekdayKey =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

export interface HorariosPorDia {
  segunda: string[];
  terca: string[];
  quarta: string[];
  quinta: string[];
  sexta: string[];
  sabado: string[];
  domingo: string[];
}

export interface Funcionario {
  id: string;
  usuario_id: string;
  usuario: {
    nome: string;
    email?: string;
    foto?: string | null;
  };
  horarios: HorariosPorDia;
}
