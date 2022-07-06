import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import GrupoCreate from "../../components/Grupo/GrupoCreate";
import GrupoEdit from "../../components/Grupo/GrupoEdit";
import GrupoList from "../../components/Grupo/GrupoList";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useGrupos } from "../../components/hooks/useGrupos";
import { useAccess } from "../../components/hooks/useResources";
import { columnGrupo } from "../../consts/columns";
import { Options } from "../IndexStyle";

const GrupoScreen = () => {
  const [
    idModule,
    idMenu,
    goPage,
    module,
    isLoadingModule,
    isErrorModule,
    errorModule,
  ] = useBreadcrumbs();
  const {
    data: grupos,
    isLoading: isLoadingGrupos,
    isError: isErrorListGrupos,
    error: errorListGrupos,
  } = useGrupos();
  const {
    data: dataAccess,
    isLoading: isLoadingAccess,
    isError: isErrorAccess,
    error: errorAccess,
  } = useAccess();

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const [afiliadoId, setId] = useState<string>("");

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (id: string) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const dataGrupos = useMemo(() => {
    const data = grupos || [];
    return data;
  }, [grupos]);

  const columns = useMemo(() => columnGrupo, []);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Grupo"
      />

      <Options>
        {isLoadingAccess ? (
          "Verificando permisos..."
        ) : isErrorAccess ? (
          "Ha ocurrido un error por favor comunicarse al soporte"
        ) : dataAccess.some((a: any) => a === "canCreate_grupos") ? (
          <Button variant="outlined" onClick={handleClickOpen}>
            Crear Grupo
          </Button>
        ) : (
          "Usted no tiene el permiso para crear grupos"
        )}
      </Options>

      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse al soporte"
      ) : dataAccess.some((a: any) => a === "canRead_grupos") ? (
        <GrupoList
          data={dataGrupos}
          columns={columns}
          handleClickOpen={handleClickOpenEdit}
        />
      ) : (
        "Usted no tiene el permiso para listar grupos"
      )}

      <GrupoCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <GrupoEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          entityId={afiliadoId}
        />
      )}
    </>
  );
};

export default GrupoScreen;
