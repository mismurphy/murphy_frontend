import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Swal from 'sweetalert2';
// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { confirmPasswordSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema, mobileNumberSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/Logo_New.png';

// ==============================|| AUTH REGISTER FORM ||============================== //

export default function AuthRegisterForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Both Password must match!'
      });
      return;
    }

    clearErrors('confirmPassword');

    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      mobile: data.number
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message || 'Registration failed'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: '✅ Registration successful!'
        }).then(() => {
          navigate(link || '/login');
        });
        reset();
      }
    } catch (err) {
      console.error('Error during registration:', err);
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
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Sign up</h4>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                {...register('firstName', firstNameSchema)}
                isInvalid={!!errors.firstName}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              />
              <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                {...register('lastName', lastNameSchema)}
                isInvalid={!!errors.email}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              />
              <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
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
        <Form.Group className="mb-3" controlId="formMobile">
          <Form.Control
            type="text"
            placeholder="Mobile Number"
            {...register('number', mobileNumberSchema)}
            isInvalid={!!errors.number}
            maxLength={10} // 👈 allow only 10 digits
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // block non-numeric keys
              }
            }}
            onInput={(e) => {
              // In case user pastes text, clean it and trim to 10 digits
              e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
            }}
            className={
              className && 'bg-transparent border-white text-white border-opacity-25'
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.number?.message}
          </Form.Control.Feedback>
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
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', confirmPasswordSchema)}
            isInvalid={!!errors.confirmPassword}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
        </Form.Group>
        <Stack direction="horizontal" className="mt-1 justify-content-between">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label="I agree to all the Terms & Condition"
              defaultChecked
              className={`input-primary ${className ? className : 'text-muted'} `}
            />
          </Form.Group>
        </Stack>
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Sign up
          </Button>
        </div>
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Already have an Account?</h6>
          <a href={link} className="link-primary">
            Login
          </a>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthRegisterForm.propTypes = { className: PropTypes.string, link: PropTypes.string };
