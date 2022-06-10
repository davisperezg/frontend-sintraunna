import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useIngresos } from "../../components/hooks/useIngreso";
import IngresoCreate from "../../components/ingreso/IngresoCreate";
import IngresoEdit from "../../components/ingreso/IngresoEdit";
import IngresoList from "../../components/ingreso/IngresotList";
import { columnIngreso } from "../../consts/columns";
import { Options } from "../IndexStyle";

const IngresoScreen = () => {
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
    data: ingresos,
    isLoading: isLoadingIngresos,
    isError: isErrorListIngresos,
    error: errorListIngresos,
  } = useIngresos();

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [ingresoId, setId] = useState<string>("");

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = (id: string) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleClickDetails = (id: string) => {
    navigate(`${location.pathname}/${id}`);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const dataIngresos = useMemo(() => {
    const data = ingresos;
    return data || [];
  }, [ingresos]);

  const columns = useMemo(() => columnIngreso, []);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Ingreso"
      />

      <Options>
        <Button variant="outlined" onClick={handleClickOpen}>
          Crear Ingreso
        </Button>
      </Options>

      <IngresoList
        data={dataIngresos}
        columns={columns}
        handleClickOpen={handleClickOpenEdit}
        handleClickDetails={handleClickDetails}
      />

      <IngresoCreate handleClose={handleClose} open={open} />

      {openEdit && (
        <IngresoEdit
          handleClose={handleCloseEdit}
          open={openEdit}
          entityId={ingresoId}
        />
      )}
    </>
  );
};

export default IngresoScreen;
