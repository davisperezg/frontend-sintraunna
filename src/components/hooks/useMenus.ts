import { useQuery } from "react-query";
import { getMenus } from "../../api/menu";
import { Menu } from "../../interface/Menu";

const KEY = "menus";

interface IError {
  request: {
    response: string;
  };
}

export function useMenus() {
  return useQuery<Menu[], IError>([KEY], getMenus);
}
