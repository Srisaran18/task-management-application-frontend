// src/pages/Login.js
import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../Config";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

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
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" mb={2}>Login</Typography>
      
      {loginError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>{loginError}</Typography>
      )}
      {loginSuccess && (
        <Typography color="success" variant="body2" sx={{ mb: 2 }}>{loginSuccess}</Typography>
      )}

      <Box component="form" onSubmit={handleLogin}>
        <TextField 
          label="Email" 
          type="email" 
          fullWidth 
          margin="normal"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          required
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          margin="normal"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          required
        />
        <Button fullWidth sx={{ mt: 2 }} variant="contained" type="submit">
          Login
        </Button>
      </Box>
      <Typography mt={2}>No account? <Link component={RouterLink} to="/signup">Sign up</Link></Typography>
    </Container>
  );
};

export default Login;