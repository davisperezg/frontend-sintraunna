import {
  Breadcrumbs,
  IconButton,
  Tooltip,
  Typography,
  Alert,
  Link,
  Button,
} from "@mui/material";
import { BackIndex } from "../IndexStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Options, TitleBack } from "./PermissionsStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../components/hooks/useModules";
import PermissionsList from "../../components/Permissions/PermissionsList";
import { useMemo, useState } from "react";
import { useResourcesToCrud } from "../../components/hooks/useResources";
import { columnResources } from "../../consts/columns";
import PermissionEdit from "../../components/Permissions/PermissionEdit";
import PermissionCreate from "../../components/Permissions/PermissionCreate";

const PermissionsScreen = () => {
  const { idModule, idMenu } = useParams();
  const navigate = useNavigate();
  const {
    data: dataModule,
    isLoading: isLoadingModule,
    isError: isErrorModule,
    error: errorModule,
  } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/module/${idModule}`);
  const {
    data: dataResources,
    isLoading: isLoadingResources,
    isError: isErrorResources,
    error: errorResources,
  } = useResourcesToCrud();
  const [openEdit, setOpenEdit] = useState(false);
  const [permissionId, setId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const columns = useMemo(() => columnResources, []);
  const dataPermissions = useMemo(() => {
    const data = dataResources;
    return data || [];
  }, [dataResources]);

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
            {module?.menu.some((a: any) => a._id === idMenu) ? "Permisos" : "#"}
          </Typography>
        </Breadcrumbs>
      </BackIndex>

      {isLoadingModule ? (
        <PermissionsList
          columns={columns}
          data={dataPermissions}
          isLoading={isLoadingModule}
          handleClickOpen={handleClickOpenEdit}
        />
      ) : isErrorModule ? (
        <Alert severity="error">
          {JSON.parse(String(errorModule?.request.response)).message}
        </Alert>
      ) : module?.menu.some((a: any) => a._id === idMenu) ? (
        <>
          <Options>
            <Button variant="outlined" onClick={handleClickOpen}>
              Crear Permiso
            </Button>
          </Options>

          <PermissionCreate handleClose={handleClose} open={open} />

          {openEdit && (
            <PermissionEdit
              handleClose={handleCloseEdit}
              open={openEdit}
              permissionId={permissionId}
            />
          )}

          {isErrorResources ? (
            <Alert severity="error">
              {JSON.parse(String(errorResources?.request.response)).message}
            </Alert>
          ) : (
            <PermissionsList
              columns={columns}
              data={dataPermissions}
              isLoading={isLoadingResources}
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

export default PermissionsScreen;
