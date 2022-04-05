import {
  Breadcrumbs,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { useMemo, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Back, TitleBack, Options } from "./UserStyle";
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
  const { idModule } = useParams();
  const { data: dataModule } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const { data: users, isLoading: isLoadingUsers } = useUsers();
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

      {isLoadingUsers ? (
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={50}
          width={150}
          style={{ marginLeft: 10 }}
        />
      ) : (
        <Options>
          <Button variant="outlined" onClick={handleClickOpen}>
            Crear Usuario
          </Button>
        </Options>
      )}

      <UserCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <UserEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          userId={userId}
        />
      )}

      <UserList
        columns={columns}
        data={dataUsers}
        isLoading={isLoadingUsers}
        handleClickOpen={handleClickOpenEdit}
      />
    </>
  );
};

export default UserScreen;
