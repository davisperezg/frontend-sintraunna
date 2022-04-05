import {
  Breadcrumbs,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
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
  const { idModule } = useParams();
  const navigate = useNavigate();
  const { data: dataModule } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/module/${idModule}`);

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
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
          <TitleBack to={`/module/${idModule}`}>{module?.name}</TitleBack>
          <Typography color="text.primary">Roles</Typography>
        </Breadcrumbs>
      </BackIndex>

      {isLoadingRoles ? (
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
            Crear Rol
          </Button>
        </Options>
      )}

      <RoleCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <RoleEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          roleId={roleId}
        />
      )}

      <RoleList
        columns={columns}
        data={dataRoles}
        isLoading={isLoadingRoles}
        handleClickOpen={handleClickOpenEdit}
      />
    </>
  );
};

export default RoleScreen;
