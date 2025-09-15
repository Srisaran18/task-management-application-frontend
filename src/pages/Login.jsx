import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Link, Divider, Card, CardContent, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../Config";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async e => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    let isValid = true;

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

    if (isValid) {
      const userData = {
        email: email,
        password: password
      };
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
        const result = await response.json();
        if (response.ok) {
          setLoginSuccess("Login successful! Redirecting to dashboard...");
          setAuth(result.user, result.token);
          setTimeout(() => navigate("/"), 1500);
        } else {
          setLoginError(result.message || "Login failed");
        }
      } catch (err) {
        setLoginError("Server error. Please try again later.");
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
            Sign in
          </Typography>
          
          {(location.state?.loggedOut) && (
            <Typography color="success" variant="body2" sx={{ mb: 2, color: '#10b981' }}>You have been logged out.</Typography>
          )}
          {loginError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, color: '#ef4444' }}>{loginError}</Typography>
          )}
          {loginSuccess && (
            <Typography color="success" variant="body2" sx={{ mb: 2, color: '#10b981' }}>{loginSuccess}</Typography>
          )}

          <Box component="form" onSubmit={handleLogin}>
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

            {/* Remember me removed as requested */}

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
              {loading ? <CircularProgress size={22} sx={{ color: '#1e293b' }} /> : 'Sign in'}
            </Button>

            <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: '#475569' } }}>
              <Typography sx={{ color: 'white', px: 2 }}>or</Typography>
            </Divider>      

            <Typography sx={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/signup" 
                sx={{ color: '#3b82f6', textDecoration: 'none' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;