import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";
import { Module } from "../../interface/Module";
import { Button, MyIconButton, TitleButton } from "./ModulesCStyle";

const ModuleItem = ({ module }: { module: Module }) => {
  const { icon = "folder", name, _id: id, status } = module;
  const navigate = useNavigate();

  const goPage = () => navigate(`/module/${id}`);

  //list icons
  //https://fonts.google.com/icons?selected=Material+Icons&icon.query=folder

  return (
    <Button
      status={Boolean(status)}
      onClick={goPage}
      disabled={status ? false : true}
    >
      <MyIconButton status={Boolean(status)}>
        <Icon sx={{ fontSize: 48 }}>{icon}</Icon>
      </MyIconButton>
      <TitleButton status={Boolean(status)}>{name}</TitleButton>
    </Button>
  );
};

export default ModuleItem;
