import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ className, children }: PageWrapperProps) {
  return <div className={cn('container mx-auto', className)}>{children}</div>
}