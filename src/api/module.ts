import axios from "axios";
import { BASE_API } from "../consts/api";
import { Module } from "../interface/Module";

interface IDataService {
  user: string;
  module: string[];
}

export const getModules = async () => {
  const { data } = await axios.get<Module[]>(`${BASE_API}/api/v1/modules`);
  return data;
};

export const getModulesList = async () => {
  const { data } = await axios.get<Module[]>(`${BASE_API}/api/v1/modules/list`);
  return data;
};

export const getModule = async (id: string) => {
  const { data } = await axios.get<Module>(
    `${BASE_API}/api/v1/modules/find/${id}`
  );

  return data;
};

export const deleteModule = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/modules/${id}`
  );

  return data;
};

export const ppModules = async (body: Module, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/modules/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/modules`, body);
    return data;
  }
};

export const restoreModel = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/modules/restore/${id}`
  );

  return data;
};

export const findServiceByUser = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/services-users/user/${id}`
  );

  return data;
};

export const createServiceUser = async (
  body: IDataService,
  idData?: string
) => {
  const { data } = await axios.post(`${BASE_API}/api/v1/services-users`, body);

  return data;
};
