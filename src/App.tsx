import { RouterProvider } from 'react-router-dom'
import { ToastContainer, Bounce } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'
import { queryClient } from './lib/utils';

function App() {
  console.log("App rendering");
  console.log("route:", router);
  console.log("queryClient", queryClient);
  
  
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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App