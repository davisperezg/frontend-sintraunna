import { Grupo } from "./Grupo";
import { Pago } from "./Pago";

export interface Afiliado {
  _id?: any;
  createdAt?: Date;
  updatedAt?: Date;
  grupo: Grupo | string;
  dni: string;
  nombres: string;
  apellidos: String;
  proyecto: string;
  puesto_trabajo?: string;
  situacion_afiliado: string;
  status?: boolean;
  full_name?: string;
  celular: string;
  motivo?: string;
  pagos: {
    nro: number;
    fecha: Date;
    destino_dinero?: string;
    pago: Pago | string;
    importe: number;
  }[];
}
