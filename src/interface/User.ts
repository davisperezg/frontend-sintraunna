import { Role } from "./Role";
export interface User {
  _id?: string;
  name: string;
  lastname: string;
  tipDocument: string;
  nroDocument: string;
  role: Role | string;
  email: string;
  owner?: User | string;
  fullname?: string;
  password?: string;
  roleId?: string;
  resource?: any[];
}
