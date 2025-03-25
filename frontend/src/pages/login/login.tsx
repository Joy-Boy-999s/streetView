import React, { useState, useContext } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  name: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm | RegisterForm>({
    resolver: yupResolver(isFlipped ? registerSchema : loginSchema),
  });

  const onSubmit = async (data: LoginForm | RegisterForm) => {
    try {
      const endpoint = isFlipped ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        login(result.token);
        toast.success('Success! Redirecting...', { autoClose: 2000 });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(result.message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    reset();
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" />
      <div className="glossy-overlay"></div>
      <div className={`auth-card ${isFlipped ? 'flip' : ''}`}>
        <div className="auth-front">
          <div className="login-card">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="label" htmlFor="email-login">Email</label>
              <input
                type="email"
                className="login-input"
                id="email-login"
                {...register('email')}
                placeholder="Enter your Email"
              />
              <p className="error-message">{errors.email?.message}</p>
              <label className="label" htmlFor="password-login">Password</label>
              <input
                type="password"
                className="login-input"
                id="password-login"
                {...register('password')}
                placeholder="Enter your password"
              />
              <p className="error-message">{errors.password?.message}</p>
              <button type="submit" className="login-button">Login</button>
            </form>
            <button className="switch-button" onClick={handleFlip}>
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
        <div className="auth-back">
          <div className="login-card">
            <h2 className="login-title">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="label" htmlFor="name-register">Name</label>
              <input
                type="text"
                className="login-input"
                id="name-register"
                {...register('name')}
                placeholder="Enter your name"
              />
              <p className="error-message">{(errors as FieldErrors<RegisterForm>).name?.message}</p>
              <label className="label" htmlFor="email-register">Email</label>
              <input
                type="email"
                className="login-input"
                id="email-register"
                {...register('email')}
                placeholder="Enter your Email"
              />
              <p className="error-message">{errors.email?.message}</p>
              <label className="label" htmlFor="password-register">Password</label>
              <input
                type="password"
                className="login-input"
                id="password-register"
                {...register('password')}
                placeholder="Enter your password"
              />
              <p className="error-message">{errors.password?.message}</p>
              <button type="submit" className="login-button">Sign Up</button>
            </form>
            <button className="switch-button" onClick={handleFlip}>
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
