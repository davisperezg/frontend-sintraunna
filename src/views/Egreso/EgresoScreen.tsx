import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import EgresoCreate from "../../components/egreso/EgresoCreate";
import EgresoEdit from "../../components/egreso/EgresoEdit";
import EgresoList from "../../components/egreso/EgresoList";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useEgresos } from "../../components/hooks/useEgreso";
import { columnEgreso } from "../../consts/columns";
import { Options } from "../IndexStyle";

const EgresoScreen = () => {
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
    data: egresos,
    isLoading: isLoadingEgresos,
    isError: isErrorListEgresos,
    error: errorListEgresos,
  } = useEgresos();

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const [egresoId, setId] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (id: string) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleClickDetails = (id: string) => {
    navigate(`${location.pathname}/${id}`);
  };

  const dataEgresos = useMemo(() => {
    const data = egresos;
    return data || [];
  }, [egresos]);

  const columns = useMemo(() => columnEgreso, []);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Egreso"
      />

      <Options>
        <Button variant="outlined" onClick={handleClickOpen}>
          Crear Egreso
        </Button>
      </Options>

      <EgresoList
        data={dataEgresos}
        columns={columns}
        handleClickOpen={handleClickOpenEdit}
        handleClickDetails={handleClickDetails}
      />

      <EgresoCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <EgresoEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          entityId={egresoId}
        />
      )}
    </>
  );
};

export default EgresoScreen;
