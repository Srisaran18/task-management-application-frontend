import React from "react";
import { Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      p: 3,
      borderRadius: 2
    }}>
      <Typography variant="h5" sx={{ color: 'white' }}>Welcome to Task Manager</Typography>
    </Box>
  );
};

export default Home;


