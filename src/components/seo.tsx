import { Helmet } from 'react-helmet-async'

export interface SeoHandle {
  seo?: {
    title: string
    description?: string
    image?: string
    url?: string
  }
}

interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const SITE_NAME = 'EventPulse'

export function Seo({ title, description, image, url }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}