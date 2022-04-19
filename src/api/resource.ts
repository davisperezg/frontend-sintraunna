import axios from "axios";
import { BASE_API } from "../consts/api";

interface IDataRole {
  role: string;
  resource: string[];
}

interface IDataUser {
  user: string;
  resource: string[];
}

export const getResources = async () => {
  const { data } = await axios.get(`${BASE_API}/api/v1/resources`);
  return data;
};

export const getResourceByRol = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/resources-roles/role/${id}`
  );
  return data;
};

export const getResourceByUser = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/resources-users/user/${id}`
  );
  return data;
};

export const createResourceRole = async (body: IDataRole, idData?: string) => {
  //create
  const { data } = await axios.post(`${BASE_API}/api/v1/resources-roles`, body);
  return data;
};

export const createResourceUser = async (body: IDataUser, idData?: string) => {
  //create
  const { data } = await axios.post(`${BASE_API}/api/v1/resources-users`, body);
  return data;
};
