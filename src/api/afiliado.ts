import axios from "axios";
import { BASE_API } from "../consts/api";
import { Afiliado } from "../interface/Afiliado";

export const getAfiliados = async () => {
  const { data } = await axios.get<Afiliado[]>(`${BASE_API}/api/v1/afiliados`);
  return data;
};

export const getAfiliado = async (id: string) => {
  const { data } = await axios.get<Afiliado>(
    `${BASE_API}/api/v1/afiliados/find/${id}`
  );
  return data;
};

export const deleteAfiliado = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/afiliados/anular/${id}`,
    motivo
  );
  return data;
};

export const ppAfiliado = async (body: Afiliado, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/afiliados/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(
      `${BASE_API}/api/v1/afiliados`,
      body
    );
    return data;
  }
};

export const restoreAfiliado = async (id: string, motivo: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/afiliados/restore/${id}`,
    motivo
  );

  return data;
};
