import React, { Component } from 'react';
import type { ReactNode } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// ---- Component Error Boundary (for wrapping components) ----

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render a custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
          <h1 className="text-2xl font-bold">Unexpected Error</h1>
          <p className="text-muted-foreground">{this.state.error?.message || 'Something went wrong'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm underline mt-4"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---- Route Error Boundary (for React Router) ----

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
        <h1 className="text-4xl font-bold">{error.status}</h1>
        <p className="text-muted-foreground">{error.statusText}</p>
        {error.data && (
          <p className="text-sm text-muted-foreground max-w-md">{error.data}</p>
        )}
        <a href="/" className="text-sm underline mt-4">
          Go home
        </a>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
        <h1 className="text-2xl font-bold">Unexpected Error</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <a href="/" className="text-sm underline mt-4">
          Go home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <a href="/" className="text-sm underline mt-4">
        Go home
      </a>
    </div>
  );
}

// Default export for convenience (component error boundary)
export default ErrorBoundary;






// import { isRouteErrorResponse, useRouteError } from 'react-router'

// export default function ErrorBoundary() {
//   const error = useRouteError()

//   if (isRouteErrorResponse(error)) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
//         <h1 className="text-4xl font-bold">{error.status}</h1>
//         <p className="text-muted-foreground">{error.statusText}</p>
//         {error.data && (
//           <p className="text-sm text-muted-foreground max-w-md">{error.data}</p>
//         )}
//         <a href="/" className="text-sm underline mt-4">
//           Go home
//         </a>
//       </div>
//     )
//   }

//   if (error instanceof Error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
//         <h1 className="text-2xl font-bold">Unexpected Error</h1>
//         <p className="text-muted-foreground">{error.message}</p>
//         <a href="/" className="text-sm underline mt-4">
//           Go home
//         </a>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-2 text-center px-4">
//       <h1 className="text-2xl font-bold">Something went wrong</h1>
//       <a href="/" className="text-sm underline mt-4">
//         Go home
//       </a>
//     </div>
//   )
// }