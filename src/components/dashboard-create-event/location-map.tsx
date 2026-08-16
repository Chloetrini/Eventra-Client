import { useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import eventraMapLoading from '@/assets/eventraMapLoading.png'

interface LocationMapProps {
  name: string
  address: string
  hours?: string
  mapQuery?: string // defaults to `${name}, ${address}` if omitted
  zoom?: number
  aspectClassName?: string // e.g. 'aspect-21/9' or 'aspect-video'
  cardClassName?: string // positioning, e.g. 'bottom-14 left-6'
  openLabel?: string // e.g. 'Open now' or 'Open in Google Maps'
  showOpenIcon?: boolean
  className?: string
}

export default function LocationMap({
  name,
  address,
  hours,
  mapQuery,
  zoom = 15,
  aspectClassName = 'aspect-40/10',
  cardClassName = 'bottom-14 left-6',
  openLabel = 'Open now',
  showOpenIcon = false,
  className,
}: LocationMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const query = mapQuery ?? `${name}, ${address}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-border', className)}>
      <iframe
        title={`Map showing ${name}`}
        src={embedSrc}
        className={cn('w-full', aspectClassName)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Loading skeleton — fades out once the embed reports loaded */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 overflow-hidden bg-muted transition-opacity duration-700 ease-out',
          isLoaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        {/* Fake street grid */}
        <svg className="size-full text-border/70" aria-hidden>
          <defs>
            <pattern id="map-skeleton-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-skeleton-grid)" />
          <path
            d="M-40 70 L340 -60"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            className="text-border"
          />
          <path
            d="M0 180 L900 140"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            className="text-border"
          />

        </svg>

        {/* Pulsing pin */}
        <div className="absolute inset-0 grid place-items-center">
              <img src={eventraMapLoading} alt="" className='w-full h-full animate-pulse'/>
        </div>
      </div>

      <Card className={cn('absolute max-w-xs gap-1 p-4', cardClassName)}>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <MapPin className="size-4 text-brand-green" /> {name}
        </p>
        <p className="text-xs text-muted-foreground">{address}</p>
        {hours && <p className="text-xs text-muted-foreground">{hours}</p>}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 flex items-center gap-1 text-xs font-medium text-brand-green hover:underline"
        >
          {openLabel} {showOpenIcon && <ArrowUpRight className="size-3" />}
        </a>
      </Card>
    </div>
  )
}