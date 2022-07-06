import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "../components/layout/Index";
import IndexScreen from "../views/Index";
import MenuScreen from "../views/Menu/MenuScreen";
import RoleScreen from "../views/Role/RoleScreen";
import UserScreen from "../views/User/UserScreen";
import "react-toastify/dist/ReactToastify.css";
import ModuleScreen from "../views/Modules/ModuleScreen";
import NotFoundScreen from "../views/NotFound/NotFoundScreen";
import PermissionsScreen from "../views/Permissions/PermissionsScreen";
import IngresoScreen from "../views/Ingreso/IngresoScreen";
import EgresoScreen from "../views/Egreso/EgresoScreen";
// import IngresoDetailsScreen from "../views/Ingreso/IngresoDetailsScreen";
import AfiliadoScreen from "../views/Afiliados/AfiliadoScreen";
import GrupoScreen from "../views/Grupo/GrupoScreen";
import PagoScreen from "../views/Pago/PagoScreen";
import ConsultaXPago from "../views/Consultas/ConsultaXPago";
import ConsultaGeneral from "../views/Consultas/ConsultaGeneral";

export const DashboardRoutes = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route path="/" element={<IndexScreen />} />
          <Route path="/module/:id" element={<MenuScreen />} />
          <Route
            path="/module/:idModule/menu/:idMenu/usuarios"
            element={<UserScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/roles"
            element={<RoleScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/modulos"
            element={<ModuleScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/permisos"
            element={<PermissionsScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/ingresos"
            element={<IngresoScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/egresos"
            element={<EgresoScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/grupos"
            element={<GrupoScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/pagos"
            element={<PagoScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/afiliados"
            element={<AfiliadoScreen />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/consulta-pagos"
            element={<ConsultaXPago />}
          />
          <Route
            path="/module/:idModule/menu/:idMenu/consulta-general"
            element={<ConsultaGeneral />}
          />
        </Routes>
        <ToastContainer />
      </Layout>
    </>
  );
};
