import axios from "axios";
import { BASE_API } from "../consts/api";
import { Role } from "../interface/Role";

export const getRoles = async () => {
  const { data } = await axios.get<Role[]>(`${BASE_API}/api/v1/roles`);
  return data;
};

export const getRole = async (id: string) => {
  const { data } = await axios.get<Role>(`${BASE_API}/api/v1/roles/find/${id}`);
  return data;
};

export const deleteRole = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/roles/${id}`
  );
  return data;
};

export const ppRoles = async (body: Role, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/roles/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/roles`, body);
    return data;
  }
};

export const restoreRole = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/roles/restore/${id}`
  );

  return data;
};
