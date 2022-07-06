import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import AfiliadoCreate from "../../components/afiliados/AfiliadoCreate";
import AfiliadoEdit from "../../components/afiliados/AfiliadoEdit";
import AfiliadoList from "../../components/afiliados/AfiliadoList";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { useAfiliados } from "../../components/hooks/useAfiliados";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useAccess } from "../../components/hooks/useResources";
import { columnAfiliado } from "../../consts/columns";
import { Options } from "../IndexStyle";

const AfiliadoScreen = () => {
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
    data: afiliados,
    isLoading: isLoadingEgresos,
    isError: isErrorListEgresos,
    error: errorListEgresos,
  } = useAfiliados();
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

  const dataAfiliados = useMemo(() => {
    const data = afiliados;
    return data || [];
  }, [afiliados]);

  const columns = useMemo(() => columnAfiliado, []);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Afiliado"
      />

      <Options>
        {isLoadingAccess ? (
          "Verificando permisos..."
        ) : isErrorAccess ? (
          "Ha ocurrido un error por favor comunicarse al soporte"
        ) : dataAccess?.some((a: any) => a === "canCreate_afiliados") ? (
          <Button variant="outlined" onClick={handleClickOpen}>
            Crear Afiliado
          </Button>
        ) : (
          "Usted no tiene el permiso para crear afiliados"
        )}
      </Options>

      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse al soporte"
      ) : dataAccess?.some((a: any) => a === "canRead_afiliados") ? (
        <AfiliadoList
          data={dataAfiliados}
          columns={columns}
          handleClickOpen={handleClickOpenEdit}
        />
      ) : (
        "Usted no tiene el permiso para este listar afiliados"
      )}

      <AfiliadoCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <AfiliadoEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          entityId={afiliadoId}
        />
      )}
    </>
  );
};

export default AfiliadoScreen;
