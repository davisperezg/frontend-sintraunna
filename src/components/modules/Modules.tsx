import { ContentButtons } from "./ModulesCStyle";
import { useContext } from "react";
import { AuthContext } from "../../stateManagement/context";
import ModuleItem from "./ModuleItem";
import { Module } from "../../interface/Module";
import { useModulesByUser } from "../hooks/useModules";

const Modules = () => {
  const { user } = useContext(AuthContext);
  const { data: modules, isLoading, isError } = useModulesByUser(user?._id);

  console.log(modules);
  return (
    <ContentButtons>
      {isLoading
        ? "Carregando..."
        : modules.map((module: Module) => (
            <ModuleItem key={module._id} module={module} />
          ))}
    </ContentButtons>
  );
};

export default Modules;
