'use client'

import { usePathname } from 'next/navigation'
import MaintenancePage from './MeintenancePage'

export default function MaintenanceController({
  children,
  maintenancePaths,
  redirectTo,
  redirectButtonText,
  maintenancePagesDescription,
}: {
  children: React.ReactNode
  maintenancePaths: string[]
  redirectTo?: string
  redirectButtonText?: string
  maintenancePagesDescription?: string
}) {
  const pathname = usePathname()

  const isMaintenance = maintenancePaths.some((path) => pathname === path || path === '*')

  if (isMaintenance) {
    return (
      <MaintenancePage
        redirectTo={redirectTo!}
        buttonText={redirectButtonText!}
        maintenancePagesDescription={maintenancePagesDescription!}
      />
    )
  }

  return <>{children}</>
}
