import axios from "axios";
import { BASE_API } from "../consts/api";
import { IConsulta } from "../interface/Consulta";
import { Pago } from "../interface/Pago";

export const getPagosToConsults = async () => {
  const { data } = await axios.get<Pago[]>(
    `${BASE_API}/api/v1/consultas/list/pagos`
  );
  return data;
};

export const getConsultaXpago = async (pago: string) => {
  const { data } = await axios.get<IConsulta>(
    `${BASE_API}/api/v1/consultas/pago/${pago}`
  );
  return data;
};

export const getConsultaGeneral = async () => {
  const { data } = await axios.get<IConsulta>(
    `${BASE_API}/api/v1/consultas/pagos`
  );
  return data;
};
