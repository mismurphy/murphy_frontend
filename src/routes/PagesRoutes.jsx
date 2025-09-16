import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';

// render - login pages
const LoginPage = Loadable(lazy(() => import('views/auth/login/Login')));

// render - register pages
const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));
const ForgotPasswordPage = Loadable(lazy(() => import('views/auth/forgotPassword/ForgotPassword')));
const VerifyOtpPage = Loadable(lazy(() => import('views/auth/verifyOtp/VerifyOtp')));
const ResetPasswordPage = Loadable(lazy(() => import('views/auth/resetPassword/ResetPassword')));


// ==============================|| AUTH PAGES ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: 'forgot-password',
          element: <ForgotPasswordPage />
        },
        {
          path: 'verify-otp',
          element: <VerifyOtpPage />
        },
        {
          path: 'reset-password',
          element: <ResetPasswordPage />
        }
      ]
    }
  ]
};

export default PagesRoutes;
