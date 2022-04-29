import { ContentButtons } from "./ModulesCStyle";
import { useContext } from "react";
import { AuthContext } from "../../stateManagement/context";
import ModuleItem from "./ModuleItem";
import { Module } from "../../interface/Module";
import { useModulesByUser } from "../hooks/useModules";
import { Alert, Skeleton } from "@mui/material";

const Modules = () => {
  const { user } = useContext(AuthContext);
  const {
    data: modules,
    isLoading,
    isError,
    error,
  } = useModulesByUser(user?._id);

  if (isError) {
    const errorServe: Error = JSON.parse(String(error?.request.response));
    return <Alert severity="error">{errorServe.message}</Alert>;
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
        : modules.map((module: Module) => (
            <ModuleItem key={module._id} module={module} />
          ))}
    </ContentButtons>
  );
};

export default Modules;
