import axios from "axios";
import { BASE_API } from "../consts/api";
import { Ingreso } from "../interface/Ingreso";

export const getIngresos = async () => {
  const { data } = await axios.get<Ingreso[]>(`${BASE_API}/api/v1/ingresos`);
  return data;
};

export const getIngreso = async (id: string) => {
  const { data } = await axios.get<Ingreso>(
    `${BASE_API}/api/v1/ingresos/find/${id}`
  );
  return data;
};

export const deleteIngreso = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/ingresos/anular/${id}`,
    motivo
  );
  return data;
};

export const ppIngreso = async (body: Ingreso, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/ingresos/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/ingresos`, body);
    return data;
  }
};

export const restoreIngreso = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/ingresos/restore/${id}`,
    motivo
  );

  return data;
};
