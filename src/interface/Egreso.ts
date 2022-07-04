import { Afiliado } from "./Afiliado";
import { User } from "./User";

export interface Egreso {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  createBy?: string | User;
  fecha: Date | null;
  detalle_egreso: string;
  nombre_destinatario: string;
  status?: boolean;
  gastos: { nro: number; gasto: string; monto: number }[];
  motivo?: string;
}
