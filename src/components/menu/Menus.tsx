import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../stateManagement/context";
import { Module } from "../../interface/Module";
import { useParams } from "react-router-dom";
import { Menu } from "../../interface/Menu";
import { ContentButtons } from "./MenuStyle";
import MenuItem from "./MenuItems";

const Menus = () => {
  const { user } = useContext(AuthContext);
  const { role } = user;
  const { module: modules } = role;
  const { id } = useParams();
  const [menus, setMenus] = useState<[]>([]);

  const findMenusByIdModulos = (id: string) => {
    const { menu } = modules.find((module: Module) => module._id === id);
    setMenus(menu);
  };

  useEffect(() => {
    if (id) findMenusByIdModulos(id);
  }, [id]);

  return (
    <ContentButtons>
      {menus.map((menu: Menu) => (
        <MenuItem key={menu._id} menu={menu} />
      ))}
    </ContentButtons>
  );
};

export default Menus;
