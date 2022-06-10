import { User } from "./User";
export interface Ingreso {
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
  realizo_actividad: string;
  nombre_actividad: string;
  ingreso_total_actividad: number;
  ingreso_apoyo_tribuna: number;
  ingreso_cuota_dirigentes: number;
  otros_ingresos: number;
  ingreso_taquilla: number;
  status?: boolean;
  motivo_editacion?: string;
  motivo_anulacion?: string;
  motivo_restauracion?: string;
}
