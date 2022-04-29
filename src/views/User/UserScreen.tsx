import {
  Alert,
  Link,
  Breadcrumbs,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { useMemo, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TitleBack, Options } from "./UserStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../components/hooks/useModules";
import UserCreate from "../../components/user/UserCreate";
import { useUsers } from "../../components/hooks/useUsers";
import { columnUsers } from "../../consts/columns";
import UserEdit from "../../components/user/UserEdit";
import UserList from "../../components/user/UserList";
import { BackIndex } from "../IndexStyle";

const UserScreen = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const { idModule, idMenu } = useParams();
  const {
    data: dataModule,
    isLoading: isLoadingModule,
    isError: isErrorModule,
    error: errorModule,
  } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorListUsers,
    error: errorListUsers,
  } = useUsers();
  const [userId, setId] = useState<string>("");

  const goMenu = () => navigate(`/module/${idModule}`);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (nroDocument: string) => {
    setOpenEdit(true);
    setId(nroDocument);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const columns = useMemo(() => columnUsers, []);
  const dataUsers = useMemo(() => {
    const data = users;
    return data || [];
  }, [users]);

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
          <TitleBack to={`/module/${idModule}`}>{module?.name}</TitleBack>
          <Typography color="text.primary">Usuarios</Typography>
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

          <UserList
            columns={columns}
            data={dataUsers}
            isLoading={isLoadingModule}
            handleClickOpen={handleClickOpenEdit}
          />
        </>
      ) : isErrorModule ? (
        <Alert severity="error">
          {JSON.parse(String(errorModule?.request.response)).message}
        </Alert>
      ) : module?.menu.some(
          (a: any) => a._id === idMenu && a.link === "usuarios"
        ) ? (
        <>
          <Options>
            <Button variant="outlined" onClick={handleClickOpen}>
              Crear Usuario
            </Button>
          </Options>
          <UserCreate handleClose={handleClose} open={open} />

          {openEdit && (
            <UserEdit
              handleClose={handleCloseEdit}
              open={openEdit}
              userId={userId}
            />
          )}

          {isErrorListUsers ? (
            <Alert severity="error">
              {JSON.parse(String(errorListUsers?.request.response)).message}
            </Alert>
          ) : (
            <UserList
              columns={columns}
              data={dataUsers}
              isLoading={isLoadingUsers}
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

export default UserScreen;
