import { Header } from "@tanstack/react-table";
import { TEgreso } from "../components/Consulta/ConsultaEgresoListModal";

export interface ITableThItem {
  header: Header<TEgreso, unknown>;
  refElement1: any;
  refElement2: any;
  refContentTHeader: any;
  setShowOptions: any;
  showOptions: boolean;
  table: any;
  isClicked: boolean;
  changeClicked: () => void;
  setSpacing: any;
  setScrolled: any;
  setLeftTable: any;
}
