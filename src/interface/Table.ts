export interface ITable {
  columns: any[];
  data: any[];
  handleClickOpen?: (id: any) => void;
  handleClickDetails?: (id: any) => void;
}
