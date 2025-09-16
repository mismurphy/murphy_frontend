import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/Logo_New.png';

// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthLoginForm({ className, link, forgotPasswordLink }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // ✅ Handle login with backend
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message || 'Invalid email or password'
        });
      } else {
        localStorage.setItem("authToken",result.token)
        Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: '✅ Login successful'
        }).then(() => {
          // redirect to dashboard (change path as needed)
          // console.log(response)
          navigate('/');
        });
        reset();
      }
    } catch (err) {
      console.error('Error during login:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.'
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
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', passwordSchema)}
              isInvalid={!!errors.password}
              className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            />
            <Button onClick={togglePasswordVisibility} type="button">
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label="Remember me?"
              defaultChecked
              className={`input-primary ${className ? className : 'text-muted'} `}
            />
          </Form.Group>
          <a href={forgotPasswordLink} className={`text-secondary f-w-400 mb-0 ${className}`}>
            Forgot Password?
          </a>
        </Stack>
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Login
          </Button>
        </div>
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
          <a href={link} className="link-primary">
            Create Account
          </a>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
  forgotPasswordLink: PropTypes.string
};
