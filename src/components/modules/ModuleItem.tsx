import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";
import { Module } from "../../interface/Module";
import { Button, MyIconButton, TitleButton } from "./ModulesCStyle";

const ModuleItem = ({ module }: { module: Module }) => {
  const { icon = "folder", name, _id: id } = module;
  const navigate = useNavigate();

  const goPage = () => navigate(`/module/${id}`);

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

export default ModuleItem;
