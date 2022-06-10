import { useModule } from "./useModules";
import { useNavigate, useParams } from "react-router-dom";
import { Module } from "../../interface/Module";
import { useEffect, useState } from "react";

const initialValue: Module = {
  name: "",
  menu: [],
};

export const useBreadcrumbs = (): [
  string,
  string,
  () => void,
  Module,
  boolean,
  boolean,
  any
] => {
  const { idModule, idMenu } = useParams();
  const navigate = useNavigate();
  const {
    data: dataModule,
    isLoading: isLoadingModule,
    isError: isErrorModule,
    error: errorModule,
  } = useModule(String(idModule));
  const goMenu = () => navigate(`/module/${idModule}`);

  const [module, setModule] = useState<Module>(initialValue);

  useEffect(() => {
    if (dataModule) {
      setModule(dataModule);
    }
  }, [dataModule]);

  return [
    idModule!,
    idMenu!,
    goMenu,
    module!,
    isLoadingModule,
    isErrorModule,
    errorModule,
  ];
};
