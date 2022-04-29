import {
  Alert,
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Options, TitleBack } from "./ModuleStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useModule, useModulesList } from "../../components/hooks/useModules";
import { useMemo, useState } from "react";
import { columnModules } from "../../consts/columns";

import { BackIndex } from "../IndexStyle";
import ModuleCreate from "../../components/modules/ModuuleCreate";
import ModuleEdit from "../../components/modules/ModuleEdit";
import ModuleList from "../../components/modules/ModuleList";

const ModuleScreen = () => {
  const { idModule, idMenu } = useParams();
  const navigate = useNavigate();
  const {
    data: dataModule,
    isLoading: isLoadingModule,
    isError: isErrorModule,
    error: errorModule,
  } = useModule(String(idModule));

  const module: any = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/module/${idModule}`);

  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorListModules,
    error: errorListModules,
  } = useModulesList();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [moduleId, setId] = useState<string>("");

  const columns = useMemo(() => columnModules, []);
  const dataModules = useMemo(() => {
    const data = modules;
    return data || [];
  }, [modules]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (idEdit: string) => {
    setOpenEdit(true);
    setId(idEdit);
  };

  const handleCloseEdit = () => setOpenEdit(false);

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
          <TitleBack to={`/module/${idModule}`}>
            {isLoadingModule
              ? "Obteniendo modulo..."
              : isErrorModule
              ? "#"
              : module?.name}
          </TitleBack>
          <Typography color="text.primary">
            {module?.menu.some((a: any) => a._id === idMenu) ? "Modulos" : "#"}
          </Typography>
        </Breadcrumbs>
      </BackIndex>

      {isLoadingModule ? (
        <>
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={50}
            width={150}
            style={{ marginLeft: 10 }}
          />

          <ModuleList
            columns={columns}
            data={dataModules}
            isLoading={isLoadingModule}
            handleClickOpen={handleClickOpenEdit}
          />
        </>
      ) : isErrorModule ? (
        <Alert severity="error">
          {JSON.parse(String(errorModule?.request.response)).message}
        </Alert>
      ) : module?.menu.some(
          (a: any) => a._id === idMenu && a.link === "modulos"
        ) ? (
        <>
          <Options>
            <Button variant="outlined" onClick={handleClickOpen}>
              Crear Modulo
            </Button>
          </Options>
          <ModuleCreate handleClose={handleClose} open={open} />

          {openEdit && (
            <ModuleEdit
              handleClose={handleCloseEdit}
              open={openEdit}
              moduleId={moduleId}
            />
          )}

          {isErrorListModules ? (
            <Alert severity="error">
              {JSON.parse(String(errorListModules?.request.response)).message}
            </Alert>
          ) : (
            <ModuleList
              columns={columns}
              data={dataModules}
              isLoading={isLoadingModules}
              handleClickOpen={handleClickOpenEdit}
            />
          )}
        </>
      ) : (
        <Alert severity="error">
          El menu no se ha encontrado. <Link href="/">Ir a mis modulos</Link>
        </Alert>
      )}
    </>
  );
};

export default ModuleScreen;
