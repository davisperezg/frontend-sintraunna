import { Afiliado } from "./Afiliado";
import { User } from "./User";
export interface Ingreso {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  createBy?: string | User;
  updateBy?: string | User;
  deleteBy?: string | User;
  restoreBy?: string | User;
  status?: boolean;
  motivo_editacion?: string;
  motivo_anulacion?: string;
  motivo_restauracion?: string;

  fecha: Date | null;
  afiliado: Afiliado | string;
  detalle_ingreso: string;
  ingresos_afiliado: {
    nro: number;
    proyecto: string;
    concepto: string;
    importe: number;
  }[];
}
