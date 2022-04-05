import axios from "axios";
import { BASE_API } from "../consts/api";
import { Menu } from "../interface/Menu";

export const getMenus = async () => {
  const { data } = await axios.get<Menu[]>(`${BASE_API}/api/v1/menus`);
  return data;
};
