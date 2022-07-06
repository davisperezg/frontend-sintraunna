import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import AfiliadoCreate from "../../components/afiliados/AfiliadoCreate";
import AfiliadoEdit from "../../components/afiliados/AfiliadoEdit";
import AfiliadoList from "../../components/afiliados/AfiliadoList";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { useAfiliados } from "../../components/hooks/useAfiliados";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { usePagos } from "../../components/hooks/usePagos";
import { useAccess } from "../../components/hooks/useResources";
import PagoCreate from "../../components/Pago/PagoCreate";
import PagoEdit from "../../components/Pago/PagoEdit";
import PagoList from "../../components/Pago/PagoList";
import { columnPago } from "../../consts/columns";
import { Options } from "../IndexStyle";

const PagoScreen = () => {
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
    data: pagos,
    isLoading: isLoadingEgresos,
    isError: isErrorListEgresos,
    error: errorListEgresos,
  } = usePagos();
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

  const dataPagos = useMemo(() => {
    const data = pagos || [];
    return data;
  }, [pagos]);

  const columns = useMemo(() => columnPago, []);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Pago"
      />

      <Options>
        {isLoadingAccess ? (
          "Verificando permisos..."
        ) : isErrorAccess ? (
          "Ha ocurrido un error por favor comunicarse al soporte"
        ) : dataAccess?.some((a: any) => a === "canCreate_pagos") ? (
          <Button variant="outlined" onClick={handleClickOpen}>
            Crear Pago
          </Button>
        ) : (
          "Usted no tiene el permiso para crear pagos"
        )}
      </Options>

      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse al soporte"
      ) : dataAccess?.some((a: any) => a === "canRead_pagos") ? (
        <PagoList
          data={dataPagos}
          columns={columns}
          handleClickOpen={handleClickOpenEdit}
        />
      ) : (
        "Usted no tiene el permiso para este listar pagos"
      )}

      <PagoCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <PagoEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          entityId={afiliadoId}
        />
      )}
    </>
  );
};

export default PagoScreen;
