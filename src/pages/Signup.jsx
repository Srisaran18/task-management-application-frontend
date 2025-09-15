// src/pages/Signup.js
import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Link, Divider, Card, CardContent, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../Config";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Signup = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async e => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    let isValid = true;

    if (name.trim() === "") {
      setNameError("Name is required.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (isValid) {
      setLoading(true);
      const userData = {
        name: name,
        email: email,
        password: password
      };
      try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
        const result = await response.json();
        if (response.ok) {
          setSignupSuccess("Registered successfully! Redirecting to login...");
          // do not auto-login; send user to login page
          setTimeout(() => navigate("/login"), 1200);
        } else {
          setSignupError(result.message || "Registration failed");
        }
      } catch (err) {
        setSignupError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{ 
        maxWidth: 400, 
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: 3,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              backgroundColor: '#3b82f6', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>T</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>Task Manager</Typography>
          </Box>

          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Sign up
          </Typography>
          
          {signupError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, color: '#ef4444' }}>{signupError}</Typography>
          )}
          {signupSuccess && (
            <Typography color="success" variant="body2" sx={{ mb: 2, color: '#10b981' }}>{signupSuccess}</Typography>
          )}

          <Box component="form" onSubmit={handleSignup}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'white', mb: 1, fontSize: '14px' }}>Name</Typography>
              <TextField 
                fullWidth 
                placeholder="Enter your name"
                value={name} 
                onChange={e => setName(e.target.value)}
                error={!!nameError}
                helperText={nameError}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    '& input': { color: 'white' },
                    '& input::placeholder': { color: '#94a3b8' }
                  },
                  '& .MuiFormHelperText-root': { color: '#ef4444' }
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'white', mb: 1, fontSize: '14px' }}>Email</Typography>
              <TextField 
                type="email" 
                fullWidth 
                placeholder="your@email.com"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    '& input': { color: 'white' },
                    '& input::placeholder': { color: '#94a3b8' }
                  },
                  '& .MuiFormHelperText-root': { color: '#ef4444' }
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'white', mb: 1, fontSize: '14px' }}>Password</Typography>
              <TextField 
                type="password" 
                fullWidth 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    '& input': { color: 'white' }
                  },
                  '& .MuiFormHelperText-root': { color: '#ef4444' }
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'white', mb: 1, fontSize: '14px' }}>Confirm Password</Typography>
              <TextField 
                type="password" 
                fullWidth 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    '& input': { color: 'white' }
                  },
                  '& .MuiFormHelperText-root': { color: '#ef4444' }
                }}
              />
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              sx={{ 
                mb: 2,
                backgroundColor: 'white',
                color: '#1e293b',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { backgroundColor: '#f1f5f9' }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#1e293b' }} /> : 'Create account'}
            </Button>

            <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: '#475569' } }}>
              <Typography sx={{ color: 'white', px: 2 }}>or</Typography>
            </Divider>

            <Typography sx={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ color: '#3b82f6', textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;