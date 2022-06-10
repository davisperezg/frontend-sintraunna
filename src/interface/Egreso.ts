import { User } from "./User";

export interface Egreso {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  createBy?: string | User;
  updateBy?: string | User;
  deleteBy?: string | User;
  restoreBy?: string | User;
  fecha: Date | null;
  partido_vs: string;
  local_visita: string;
  fase_copaPeru: string;
  status?: boolean;
  gastos: { nro: number; gasto: string; monto: number }[];
  motivo_editacion?: string;
  motivo_anulacion?: string;
  motivo_restauracion?: string;
}
