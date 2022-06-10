import { Egreso } from "./../interface/Egreso";
import axios from "axios";
import { BASE_API } from "../consts/api";

export const getEgresos = async () => {
  const { data } = await axios.get<Egreso[]>(`${BASE_API}/api/v1/egresos`);
  return data;
};

export const getEgreso = async (id: string) => {
  const { data } = await axios.get<Egreso>(
    `${BASE_API}/api/v1/egresos/find/${id}`
  );
  return data;
};

export const deleteEgreso = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/egresos/anular/${id}`,
    motivo
  );
  return data;
};

export const ppEgreso = async (body: Egreso, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/egresos/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/egresos`, body);
    return data;
  }
};

export const restoreEgreso = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/egresos/restore/${id}`,
    motivo
  );

  return data;
};
