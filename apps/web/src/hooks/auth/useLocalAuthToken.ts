import { useQuery } from "@tanstack/react-query"

const QUERY_KEY = 'local-auth-token';

export function useLocalAuthToken() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => localStorage.getItem('jwt')
  })
}

useLocalAuthToken.queryKey = QUERY_KEY