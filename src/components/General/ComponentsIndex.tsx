import { Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StyledMenu } from "./CSSIndex";

export const ActionesButton = ({
  anchorEl,
  handleClick,
  handleClose,
  children,
}: any) => {
  //const open = ;

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        id="demo-customized-button"
        aria-controls={Boolean(anchorEl) ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
    </div>
  );
};
