import axios from "axios";
import { BASE_API } from "../consts/api";

interface IData {
  role: string;
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

export const createResource = async (body: IData, idData?: string) => {
  //create
  const { data } = await axios.post(`${BASE_API}/api/v1/resources-roles`, body);
  return data;
};
