'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import NextLink from 'next/link';

import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';
import { useUserContext } from '@/app/providers/global.providers/user.povider';
import { LoginCommand } from '@/application/httpRequests/user/LoginRequest';

const LoginPage: React.FC = () => {
  const { login } = useUserContext();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const command: LoginCommand = {
      email: formData.username,
      password: formData.password,
    };
    const response = await login(command);
    if (!response.isSuccess) {
      setError(response.errorMessage!);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="flex flex-col items-center justify-center min-h-screen" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} 
        className="w-full flex flex-col" noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && (
            <Typography color="error" variant="body2" className="mt-2">
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" color="primary" className="mt-4">
            Login
          </Button>
        </Box>
        <Typography variant="body2" className="mt-4">
          Don't have an account?{' '}
          <Link component={NextLink} href="/signin" underline="hover">
            Sign up here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
