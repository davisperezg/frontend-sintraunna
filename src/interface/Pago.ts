export interface Pago {
  _id?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  concepto: string;
  importe: number;
}
