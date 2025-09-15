import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import API_BASE from "../Config";

const Home = () => {
  const [counts, setCounts] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/tasks`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load tasks");
        const total = Array.isArray(data) ? data.length : 0;
        let pending = 0, inProgress = 0, completed = 0;
        (data || []).forEach(t => {
          const s = (t.status || "").toLowerCase();
          if (s === "pending") pending += 1;
          else if (s === "in progress") inProgress += 1;
          else if (s === "completed") completed += 1;
        });
        setCounts({ total, pending, inProgress, completed });
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      p: { xs: 1.5, sm: 2, md: 3 },
      borderRadius: { xs: 0, sm: 1, md: 2 }
    }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Welcome to Task Manager</Typography>
      {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, backgroundColor: '#0b1221', border: '1px solid #334155', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Total Tasks</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>{counts.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, backgroundColor: '#0b1221', border: '1px solid #334155', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Pending</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: '#fde047' }}>{counts.pending}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, backgroundColor: '#0b1221', border: '1px solid #334155', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>In Progress</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: '#60a5fa' }}>{counts.inProgress}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, backgroundColor: '#0b1221', border: '1px solid #334155', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Completed</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: '#4ade80' }}>{counts.completed}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;


