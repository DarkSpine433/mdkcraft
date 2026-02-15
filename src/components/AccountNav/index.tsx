'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-1">
        {[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/orders', label: 'Moje_Zamówienia' },
          { href: '/account', label: 'Profil_Użytkownika' },
          { href: '/account/addresses', label: 'Twoje_Adresy' },
          { href: '/settings', label: 'Ustawienia_Systemu' },
          { href: '/notifications', label: 'Powiadomienia' },
          { href: '/privacy', label: 'Prywatność' },
          { href: '/tickets', label: 'Wsparcie_Specjalisty' },
        ].map((item) => (
          <li key={item.href}>
            <Button asChild variant="link" className="h-9 px-0 justify-start">
              <Link
                href={item.href}
                className={clsx(
                  'text-[11px] uppercase tracking-widest font-mono transition-all hover:no-underline',
                  pathname === item.href ? 'text-primary' : 'text-neutral-500 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>

      <hr className="w-full border-white/5" />
    </div>
  )
}
