import {
  Alert,
  Breadcrumbs,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { Options, TitleBack } from "./RoleStyle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../components/hooks/useModules";
import { useRoles } from "../../components/hooks/useRoles";
import { useMemo, useState } from "react";
import { columnRoles } from "../../consts/columns";
import RoleList from "../../components/rol/RoleList";
import RoleEdit from "../../components/rol/RoleEdit";
import RoleCreate from "../../components/rol/RoleCreate";
import { BackIndex } from "../IndexStyle";

const RoleScreen = () => {
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
    data: roles,
    isLoading: isLoadingRoles,
    isError: isErrorListRoles,
    error: errorListRoles,
  } = useRoles();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [roleId, setId] = useState<string>("");

  const columns = useMemo(() => columnRoles, []);
  const dataRoles = useMemo(() => {
    const data = roles;
    return data || [];
  }, [roles]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (nroDocument: string) => {
    setOpenEdit(true);
    setId(nroDocument);
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
            {module?.menu.some((a: any) => a._id === idMenu) ? "Roles" : "#"}
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

          <RoleList
            columns={columns}
            data={dataRoles}
            isLoading={isLoadingModule}
            handleClickOpen={handleClickOpenEdit}
          />
        </>
      ) : isErrorModule ? (
        <Alert severity="error">
          {JSON.parse(String(errorModule?.request.response)).message}
        </Alert>
      ) : module?.menu.some(
          (a: any) => a._id === idMenu && a.link === "roles"
        ) ? (
        <>
          <Options>
            <Button variant="outlined" onClick={handleClickOpen}>
              Crear Rol
            </Button>
          </Options>

          <RoleCreate handleClose={handleClose} open={open} />

          {openEdit && (
            <RoleEdit
              handleClose={handleCloseEdit}
              open={openEdit}
              roleId={roleId}
            />
          )}

          {isErrorListRoles ? (
            <Alert severity="error">
              {JSON.parse(String(errorListRoles?.request.response)).message}
            </Alert>
          ) : (
            <RoleList
              columns={columns}
              data={dataRoles}
              isLoading={isLoadingRoles}
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

export default RoleScreen;
