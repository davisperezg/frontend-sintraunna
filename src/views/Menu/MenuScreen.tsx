import {
  Alert,
  Breadcrumbs,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import Menus from "../../components/menu/Menus";
import { BackIndex, Content } from "../IndexStyle";
import { TitleBack } from "./MenuStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../components/hooks/useModules";
import { ContentButtons } from "../../components/menu/MenuStyle";
import { useEffect } from "react";

const MenuScreen = () => {
  const navigate = useNavigate();
  const { id: idModule } = useParams();
  const {
    data: dataModule,
    isLoading,
    isError,
    error,
  } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/`);

  useEffect(() => {
    if (isError) {
      if (JSON.parse(String(error?.request.response)).statusCode === 500) {
        goMenu();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.request.response, isError]);

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
          <Typography color="text.primary">
            {isLoading ? "Obteniendo modulo..." : isError ? "#" : module?.name}
          </Typography>
        </Breadcrumbs>
      </BackIndex>
      {isLoading ? (
        <ContentButtons>
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton
              key={n}
              animation="wave"
              variant="rectangular"
              height={90}
              width={215}
            />
          ))}
        </ContentButtons>
      ) : isError ? (
        <Alert severity="error">
          {JSON.parse(String(error?.request.response)).message}
        </Alert>
      ) : (
        <Content>
          <Menus />
        </Content>
      )}
    </>
  );
};

export default MenuScreen;
