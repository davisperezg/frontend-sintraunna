import { IconButton, Tooltip, Breadcrumbs, Typography } from "@mui/material";
import { ContentBreadcrumbs, Title } from "./BreadStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Module } from "../../interface/Module";

interface Props {
  goPage: () => void;
  idModule: string;
  idMenu: string;
  module: Module;
  isLoadingModule: boolean;
  isErrorModule: boolean;
  nameMenu: string;
  addTitle?: JSX.Element | JSX.Element[];
}

const MyBreadcrumbs = ({
  goPage,
  idModule,
  idMenu,
  nameMenu,
  isLoadingModule,
  isErrorModule,
  module,
  addTitle,
}: Props) => {
  return (
    <ContentBreadcrumbs>
      <Tooltip title="Regresar" arrow onClick={goPage}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Breadcrumbs aria-label="breadcrumb">
        <Title to={`/`}>Modulos</Title>
        <Title to={`/module/${idModule}`}>
          {isLoadingModule
            ? "Obteniendo modulo..."
            : isErrorModule
            ? "#"
            : module?.name}
        </Title>
        {addTitle}
        <Typography color="text.primary">
          {module?.menu.some((a: any) => a._id === idMenu) ? nameMenu : "#"}
        </Typography>
      </Breadcrumbs>
    </ContentBreadcrumbs>
  );
};

export default MyBreadcrumbs;
