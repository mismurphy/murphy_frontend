import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

// project-imports
import MainCard from 'components/MainCard';
import { passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/Logo_New.png';

// ==============================|| RESET PASSWORD FORM ||============================== //

export default function AuthResetPasswordForm({ className, link }) {
  const navigate = useNavigate();
  const location = useLocation();

  // get email + otp from VerifyOtpForm
  const { email, otp } = location.state || {};

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Both Passwords must match!'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password: data.password })
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: result.message || 'Could not reset password.'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset!',
          text: '🎉 You can now login with your new password.'
        }).then(() => {
          navigate(link || '/login');
        });
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center">
        <Image src={DarkLogo} alt="Logo" />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Reset Password</h4>

        {/* New Password */}
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="New Password"
            {...register('password', passwordSchema)}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', { required: 'Please confirm your password' })}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Reset Password
          </Button>
        </div>
      </Form>
    </MainCard>
  );
}

AuthResetPasswordForm.propTypes = { className: PropTypes.string, link: PropTypes.string };
