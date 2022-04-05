import { Breadcrumbs, IconButton, Tooltip, Typography } from "@mui/material";
import Menus from "../../components/menu/Menus";
import { BackIndex, Content } from "../IndexStyle";
import { Back, TitleBack } from "./MenuStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../components/hooks/useModules";

const MenuScreen = () => {
  const navigate = useNavigate();
  const { id: idModule } = useParams();
  const { data: dataModule } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/`);

  return (
    <>
      <BackIndex>
        <Tooltip title="Regresar" arrow onClick={goMenu}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Breadcrumbs aria-label="breadcrumb">
          <TitleBack to={`/`}>Modulos</TitleBack>
          <Typography color="text.primary">{module?.name}</Typography>
        </Breadcrumbs>
      </BackIndex>
      <Content>
        <Menus />
      </Content>
    </>
  );
};

export default MenuScreen;
