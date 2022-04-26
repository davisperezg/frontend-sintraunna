import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../stateManagement/context";
import { Module } from "../../interface/Module";
import { useParams } from "react-router-dom";
import { Menu } from "../../interface/Menu";
import { ContentButtons } from "./MenuStyle";
import MenuItem from "./MenuItems";
import { useModulesByUser } from "../hooks/useModules";

const Menus = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [menus, setMenus] = useState<[]>([]);
  const { data: modules, isLoading, isError } = useModulesByUser(user?._id);

  const findMenusByIdModulos = (id: string) => {
    const allMenus = modules?.find((module: Module) => module._id === id) || [];
    console.log("sus menus son:", allMenus);
    setMenus(allMenus.menus);
  };

  useEffect(() => {
    if (id) {
      const allMenus =
        modules?.find((module: Module) => module._id === id) || [];
      console.log("sus menus son:", allMenus);
      setMenus(allMenus?.menus);
    }
  }, [id, modules]);

  return (
    <ContentButtons>
      {isLoading
        ? "Carregando..."
        : menus?.map((menu: Menu) => <MenuItem key={menu._id} menu={menu} />)}
    </ContentButtons>
  );
};

export default Menus;
