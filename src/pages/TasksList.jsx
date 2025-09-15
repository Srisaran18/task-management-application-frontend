import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import API_BASE from "../Config";
import { useNavigate } from "react-router-dom";

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load tasks");
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      p: 3,
      borderRadius: 2
    }}>
      {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
      <Paper sx={{ backgroundColor: '#1e293b', color: 'white' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#334155' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Task</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'white' }}>Loading...</TableCell></TableRow>
            ) : tasks.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'white' }}>No tasks</TableCell></TableRow>
            ) : (
              tasks.map(t => (
                <TableRow key={t._id} hover onClick={() => setSelected(t)} style={{ cursor: 'pointer' }}>
                  <TableCell sx={{ color: 'white' }}>{t.title}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{t.description}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{t.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: 'white' }}>Task Details</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>{selected?.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>{selected?.description}</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>Status: {selected?.status}</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b' }}>
          <Button onClick={() => setSelected(null)} sx={{ color: 'white' }}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => { const t = selected; setSelected(null); navigate(`/tasks/new`, { state: { edit: t } }); }}
            sx={{ 
              backgroundColor: 'white',
              color: '#1e293b',
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksList;


