import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteGrupo,
  getGrupo,
  getGrupos,
  ppGrupos,
  restoreGrupo,
} from "../../api/grupo";
import { Grupo } from "../../interface/Grupo";

const KEY = "grupos";

interface ICreateParams {
  dataGrupo: Grupo;
  idUpdateData?: string;
}

interface IDelteParams {
  id: string;
}

interface IError {
  request: {
    response: string;
  };
}

export const useMutateGrupo = () => {
  const queryClient = useQueryClient();

  return useMutation<Grupo, IError, ICreateParams>(
    ({ dataGrupo, idUpdateData }) => ppGrupos(dataGrupo, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (res.updated) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY], (prevGrupos: any) =>
            prevGrupos.concat(created)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useGrupos = () => {
  return useQuery<Grupo[], IError>([KEY], getGrupos);
};

export const useGrupo = (id: string) => {
  return useQuery<Grupo, IError>([KEY, id], () => getGrupo(id));
};

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => deleteGrupo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestoreGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => restoreGrupo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};
