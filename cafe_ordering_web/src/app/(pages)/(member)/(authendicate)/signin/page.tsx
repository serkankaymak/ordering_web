'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import NextLink from 'next/link';

import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';
import { SigninCommand } from '@/application/httpRequests/user/SigninRequest';
import { useUserContext } from '@/app/providers/global.providers/user.provider';
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları


const SigninPage: React.FC = () => {
  const { signIn } = useUserContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const command: SigninCommand = {
      email: formData.email,
      password: formData.password,
    };
    const response = await signIn(command);
    if (!response.isSuccess) {
      setError(response.errorMessage!);
    }
    else { router.push('/'); }
  };

  return (
    <Container maxWidth="sm">
      <Box className="flex flex-col items-center justify-center min-h-screen" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit}
          className="w-full flex flex-col" noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type='email'
            value={formData.email}
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


          <TextField
            fullWidth
            margin="normal"
            label="Birthday"
            name="birthday"
            type="date"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          {error && (
            <Typography color="error" variant="body2" className="mt-2">
              {error}
            </Typography>
          )}
          <Button
            type="submit" fullWidth variant="contained" color="primary"
            className="mt-4">
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" className="mt-4">
          Already a member?{' '}
          <Link component={NextLink} href="/login" underline="hover">
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SigninPage;


