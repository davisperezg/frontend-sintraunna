import Icon from "@mui/material/Icon";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../interface/Menu";
import { Button, MyIconButton, TitleButton } from "./MenuStyle";

const MenuItem = ({ menu }: { menu: Menu }) => {
  const { icon = "folder", name, _id: idMenu, link } = menu;
  const navigate = useNavigate();
  const { id: idModule } = useParams();

  const goPage = () => navigate(`/module/${idModule}/menu/${idMenu}/${link}`);

  //list icons
  //https://fonts.google.com/icons?selected=Material+Icons&icon.query=folder

  return (
    <Button onClick={goPage}>
      <MyIconButton>
        <Icon sx={{ fontSize: 48 }}>{icon}</Icon>
      </MyIconButton>
      <TitleButton>{name}</TitleButton>
    </Button>
  );
};

export default MenuItem;
