import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// project-imports
import router from 'routes';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function App() {
  return (
    <AuthProvider><RouterProvider router={router} /></AuthProvider>

  )
}

export default App;
