import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/Logo_New.png';

// ==============================|| AUTH FORGOT PASSWORD FORM ||============================== //

export default function AuthForgotPasswordForm({ className, link }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: result.message || 'Something went wrong. Please try again.'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: '📩 Please check your email for the OTP code.'
        }).then(() => {
          // ✅ Redirect to OTP verification page & pass email
          navigate('/verify-otp', { state: { email: data.email } });
        });
        reset();
      }
    } catch (err) {
      console.error('Error during forgot password:', err);
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
        <a>
          <Image src={DarkLogo} alt="img" />
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Forgot Password</h4>

        {/* Email Input */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit */}
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Send OTP
          </Button>
        </div>

        {/* Link to Register */}
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don&apos;t have an Account?</h6>
          <a href={link} className="link-primary">
            Create Account
          </a>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthForgotPasswordForm.propTypes = { 
  className: PropTypes.string, 
  link: PropTypes.string 
};
