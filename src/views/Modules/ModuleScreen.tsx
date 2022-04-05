import {
  Breadcrumbs,
  Button,
  IconButton,
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
  const { idModule } = useParams();
  const navigate = useNavigate();
  const { data: dataModule } = useModule(String(idModule));
  const module = dataModule ? dataModule : undefined;
  const goMenu = () => navigate(`/module/${idModule}`);

  const { data: modules, isLoading: isLoadingModules } = useModulesList();
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
          <TitleBack to={`/module/${idModule}`}>{module?.name}</TitleBack>
          <Typography color="text.primary">Modulos</Typography>
        </Breadcrumbs>
      </BackIndex>

      {isLoadingModules ? (
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
            Crear Modulo
          </Button>
        </Options>
      )}

      <ModuleCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <ModuleEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          moduleId={moduleId}
        />
      )}

      <ModuleList
        columns={columns}
        data={dataModules}
        isLoading={isLoadingModules}
        handleClickOpen={handleClickOpenEdit}
      />
    </>
  );
};

export default ModuleScreen;
