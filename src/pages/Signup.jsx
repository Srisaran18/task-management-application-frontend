// src/pages/Signup.js
import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Link } from "@mui/material";
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
          setSignupSuccess("Registered successfully! Redirecting to dashboard...");
          setAuth(result.user, result.token);
          setTimeout(() => navigate("/"), 1500);
        } else {
          setSignupError(result.message || "Registration failed");
        }
      } catch (err) {
        setSignupError("Server error. Please try again later.");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" mb={2}>Sign up</Typography>
      
      {signupError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>{signupError}</Typography>
      )}
      {signupSuccess && (
        <Typography color="success" variant="body2" sx={{ mb: 2 }}>{signupSuccess}</Typography>
      )}

      <Box component="form" onSubmit={handleSignup}>
        <TextField 
          label="Name" 
          fullWidth 
          margin="normal"
          value={name} 
          onChange={e => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          required
        />
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
        <TextField 
          label="Confirm Password" 
          type="password" 
          fullWidth 
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          required
        />
        <Button fullWidth sx={{ mt: 2 }} variant="contained" type="submit">
          Create account
        </Button>
      </Box>
      <Typography mt={2}>Already have an account? <Link component={RouterLink} to="/login">Login</Link></Typography>
    </Container>
  );
};

export default Signup;