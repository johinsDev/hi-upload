import { useQuery, UseQueryResult } from "react-query";

export default function useUser(): UseQueryResult<IUser, any> {
  return useQuery<IUser>("auth/me", {
    retry: false,
    staleTime: 60 * 1000,
  });
}
