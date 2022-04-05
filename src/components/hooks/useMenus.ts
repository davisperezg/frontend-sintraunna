import { useQuery } from "react-query";
import { getMenus } from "../../api/menu";
import { Menu } from "../../interface/Menu";

const KEY = "users";

export function useMenus() {
  return useQuery<Menu[], Error>([KEY], getMenus);
}
