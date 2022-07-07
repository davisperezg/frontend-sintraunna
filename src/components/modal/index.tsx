import { styled } from "@mui/material/styles";
import { DialogTitle, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

export const BootstrapDialog = styled(Dialog)<{ myWidth?: string }>(
  ({ theme, myWidth = "600px" }) => ({
    "& .MuiDialogContent-root": {
      padding: 0,
      height: "500px",
      width: myWidth,
      overflow: "hidden",
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  })
);
//height: 404px;  overflow: auto;
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
