import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/Logo_New.png';

// ==============================|| VERIFY OTP FORM ||============================== //

export default function AuthVerifyOtpForm({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from ForgotPassword
  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { email } });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, otp: data.otp })
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: result.message || 'Invalid OTP.'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'OTP Verified!',
          text: '✅ You can now reset your password.'
        }).then(() => {
          // Navigate to reset password page, carry email + otp
          navigate('/reset-password', { state: { email: data.email, otp: data.otp } });
        });
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Try again later.'
      });
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center">
        <Image src={DarkLogo} alt="Logo" />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Verify OTP</h4>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            readOnly
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* OTP */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter OTP"
            {...register('otp', { required: 'OTP is required' })}
            isInvalid={!!errors.otp}
          />
          <Form.Control.Feedback type="invalid">{errors.otp?.message}</Form.Control.Feedback>
        </Form.Group>

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Verify OTP
          </Button>
        </div>
      </Form>
    </MainCard>
  );
}

AuthVerifyOtpForm.propTypes = { className: PropTypes.string };
