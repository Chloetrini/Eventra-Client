import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4 bg-background text-foreground">
        <h1 className="text-4xl font-bold">{error.status}</h1>
        <p className="text-muted-foreground">{error.statusText}</p>
        {error.data && (
          <p className="text-sm text-muted-foreground max-w-md">{error.data}</p>
        )}
        <a href="/" className="text-sm underline text-primary hover:text-primary/80 mt-4">
          Go home
        </a>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4 bg-background text-foreground">
        <h1 className="text-2xl font-bold">Unexpected Error</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <a href="/" className="text-sm underline text-primary hover:text-primary/80 mt-4">
          Go home
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <a href="/" className="text-sm underline text-primary hover:text-primary/80 mt-4">
        Go home
      </a>
    </div>
  )
}