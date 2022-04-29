import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../stateManagement/context";
import { Module } from "../../interface/Module";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../interface/Menu";
import { ContentButtons } from "./MenuStyle";
import MenuItem from "./MenuItems";
import { useModulesByUser } from "../hooks/useModules";
import { Alert, Skeleton } from "@mui/material";

const Menus = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [menus, setMenus] = useState<[]>([]);
  const {
    data: modules,
    isLoading,
    isError,
    error,
  } = useModulesByUser(user?._id);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const allMenus =
        modules?.find((module: Module) => module._id === id) || [];
      setMenus(allMenus?.menus);
      if (allMenus.length === 0) {
        navigate(`/`);
      }
    }
  }, [id, modules, navigate]);

  if (isError) {
    const errorServe: Error = JSON.parse(String(error?.request.response));
    return <Alert severity="error">{errorServe.message}</Alert>;
  }

  if (menus.length === 0) {
    return (
      <Alert severity="warning">No tienes menus asignados a este modulo.</Alert>
    );
  }

  return (
    <ContentButtons>
      {isLoading
        ? [1, 2, 3, 4, 5].map((n) => (
            <Skeleton
              key={n}
              animation="wave"
              variant="rectangular"
              height={90}
              width={215}
            />
          ))
        : menus?.map((menu: Menu) => <MenuItem key={menu._id} menu={menu} />)}
    </ContentButtons>
  );
};

export default Menus;
