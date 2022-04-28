import { Module } from "./Module";

export interface Role {
  _id?: string;
  name: string;
  description?: string;
  module: Module[] | string[];
  status?: boolean;
  creator?: string;
}
