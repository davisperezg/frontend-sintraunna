export interface IModal {
  handleClose: () => void;
  open: boolean;
  entityId?: string;
}
