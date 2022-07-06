import { useQuery } from "react-query";
import {
  getConsultaGeneral,
  getConsultaXpago,
  getPagosToConsults,
} from "../../api/consulta";
import { IConsulta } from "../../interface/Consulta";
import { Pago } from "../../interface/Pago";

interface IError {
  request: {
    response: string;
  };
}

const KEY = "consulta_pago";

export const useConsultaXpago = (id: string) => {
  return useQuery<IConsulta, IError>([KEY, id], () => getConsultaXpago(id), {
    enabled: false,
    cacheTime: 0,
  });
};

export const useConsultaGeneral = () => {
  return useQuery<IConsulta, IError>([KEY], getConsultaGeneral);
};

export const usePagosConsults = () => {
  return useQuery<Pago[], IError>([KEY], getPagosToConsults);
};
