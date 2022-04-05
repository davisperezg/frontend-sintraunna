import { ContentButtons } from "./ModulesCStyle";
import { useContext } from "react";
import { AuthContext } from "../../stateManagement/context";
import ModuleItem from "./ModuleItem";
import { Module } from "../../interface/Module";

const Modules = () => {
  const { user } = useContext(AuthContext);
  const { role } = user;
  const { module: modules } = role;

  return (
    <ContentButtons>
      {modules.map((module: Module) => (
        <ModuleItem key={module._id} module={module} />
      ))}
    </ContentButtons>
  );
};

export default Modules;
