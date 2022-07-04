import axios from "axios";
import { BASE_API } from "../consts/api";
import { Grupo } from "../interface/Grupo";

export const getGrupos = async () => {
  const { data } = await axios.get<Grupo[]>(`${BASE_API}/api/v1/grupos`);
  return data;
};

export const getGrupo = async (id: string) => {
  const { data } = await axios.get<Grupo>(
    `${BASE_API}/api/v1/grupos/find/${id}`
  );
  return data;
};

export const deleteGrupo = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/grupos/${id}`
  );
  return data;
};

export const ppGrupos = async (body: Grupo, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/grupos/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/grupos`, body);
    return data;
  }
};

export const restoreGrupo = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/grupos/restore/${id}`
  );

  return data;
};
