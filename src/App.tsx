import { RouterProvider } from 'react-router'
import { ToastContainer, Bounce } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'
import { queryClient } from './lib/utils';
import { AuthProvider } from '@/context/auth.context';

function App() {
  return (
    <>
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App