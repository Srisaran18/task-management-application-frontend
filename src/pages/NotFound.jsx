import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 800 }}>404</Typography>
        <Typography variant="h5" sx={{ color: '#94a3b8', mt: 1 }}>Page not found</Typography>
        <Button onClick={() => navigate('/')} variant="contained" sx={{ mt: 3, backgroundColor: 'white', color: '#1e293b', '&:hover': { backgroundColor: '#f1f5f9' } }}>
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;


