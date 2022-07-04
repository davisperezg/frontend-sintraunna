import axios from "axios";
import { BASE_API } from "../consts/api";
import { Pago } from "../interface/Pago";

export const getPagos = async () => {
  const { data } = await axios.get<Pago[]>(`${BASE_API}/api/v1/pagos`);
  return data;
};

export const getPago = async (id: string) => {
  const { data } = await axios.get<Pago>(`${BASE_API}/api/v1/pagos/find/${id}`);
  return data;
};

export const deletePago = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/pagos/${id}`
  );
  return data;
};

export const ppPagos = async (body: Pago, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/pagos/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/pagos`, body);
    return data;
  }
};

export const restorePago = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/pagos/restore/${id}`
  );

  return data;
};
