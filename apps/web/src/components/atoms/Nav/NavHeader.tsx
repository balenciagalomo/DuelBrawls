import Image from 'next/image'

import Logo from '@/app/assets/svgs/logo.svg'
import { Wallet } from "@/components/atoms/Nav/Wallet";
import { Balance } from "@/components/atoms/Nav/Balance";
import Link from 'next/link';

export function NavHeader() {
  return (
    <nav className="w-full py-4 px-4 flex flex-row items-center justify-between">
      <Link href="/">
        <Image src={Logo} width={92} height={30} alt="logo" />
      </Link>
      <div className="flex flex-row gap-x-4">
        <Balance />
        <Wallet />
      </div>
    </nav>
  );
}
