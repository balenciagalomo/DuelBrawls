import { createContext, PropsWithChildren, useContext } from "react"

import { useMe } from "@/hooks/auth/useMe"
import { useDeposit } from "@/hooks/balances/useDeposit";

type ProviderContextProps = {
  meQuery: ReturnType<typeof useMe>;
  deposit: ReturnType<typeof useDeposit>
  onDeposit: (amount: number) => Promise<void>
}

const ProfileContext = createContext<ProviderContextProps | null>(null)

export function useProfileContext() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('Profile provider not found')
  return context
}

type ProfileProviderProps = {

}

export function ProfileProvider(props: PropsWithChildren<ProfileProviderProps>) {
  const { children } = props;
  const meQuery = useMe()
  const deposit = useDeposit()
  const onDeposit = async (amount: number) => {
    await deposit.mutateAsync(amount)
  }
  return (
    <ProfileContext.Provider value={{
      meQuery,
      deposit,
      onDeposit
    }}>
      {children}
    </ProfileContext.Provider>
  )
}