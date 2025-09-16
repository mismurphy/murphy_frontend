import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import MainCard from 'components/MainCard';
import axios from 'axios';

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Frontend validation
    if (!email) return setError('Email is required');
    if (!oldPassword) return setError('Old password is required');
    if (!newPassword) return setError('New password is required');
    if (newPassword !== confirmPassword) return setError('New password and confirm password do not match');

    // Strong password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;
    if (!passwordRegex.test(newPassword))
      return setError(
        'Password must be at least 10 characters long and include uppercase, lowercase, number, and special character'
      );

    try {
      const response = await axios.post('/api/profile/change-password', { email, oldPassword, newPassword });
      setMessage(response.data.message);

      // Reset form
      setEmail('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <Row className="justify-content-center">
      <Col xl={6}>
        <MainCard title="Change Password" className="text-center">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={4}>Email</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formOldPassword">
              <Form.Label column sm={4}>Old Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formNewPassword">
              <Form.Label column sm={4}>New Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
              <Form.Label column sm={4}>Confirm Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="shadow px-4">Change Password</Button>
            </div>
          </Form>
        </MainCard>
      </Col>
    </Row>
  );
}
