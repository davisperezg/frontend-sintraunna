import { Menu } from "./Menu";

export interface Module {
  _id?: string;
  name: string;
  icon?: string;
  color?: string;
  menu: Menu[] | string[];
  status?: boolean;
  description?: string;
}
