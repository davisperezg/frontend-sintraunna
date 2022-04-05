import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteUser,
  getUser,
  getUsers,
  ppUser,
  changePassword,
  restoreUser,
} from "../../api/user";
import { User } from "../../interface/User";

const KEY = "users";

interface ICreateParams {
  dataUser: User;
  idUpdateData?: string;
}

interface IDelteParams {
  id: string;
}

interface IChangePassword {
  id: string;
  body: {
    password: string;
  };
}

interface IError {
  request: {
    response: string;
  };
}

export const useMutateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, IError, ICreateParams>(
    ({ dataUser, idUpdateData }) => ppUser(dataUser, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (!res.user) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { user } = res;
          queryClient.setQueryData([KEY], (prevUsers: any) =>
            prevUsers.concat(user)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useUsers = () => {
  return useQuery<User[], IError>([KEY], getUsers);
};

export const useUser = (id: string) => {
  return useQuery<User, IError>([KEY, id], () => getUser(id));
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useChangePassword = () => {
  return useMutation<Boolean, IError, IChangePassword>(({ id, body }) =>
    changePassword(id, body)
  );
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => restoreUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};
