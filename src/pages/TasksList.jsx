import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import API_BASE from "../Config";
import { useNavigate } from "react-router-dom";

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      p: { xs: 1.5, sm: 2, md: 3 },
      borderRadius: { xs: 0, sm: 1, md: 2 }
    }}>
      {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-filter-label" sx={{ color: 'white' }}>Filter by status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
              '.MuiSvgIcon-root': { color: 'white' }
            }}
            MenuProps={{
              PaperProps: { sx: { backgroundColor: '#0b1221', color: 'white' } }
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Paper sx={{ backgroundColor: '#1e293b', color: 'white', overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead sx={{ backgroundColor: '#334155' }}>
            <TableRow sx={{ '& th': { py: 1.5 } }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.no</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Task</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'white' }}>Loading...</TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'white' }}>No tasks</TableCell>
              </TableRow>
            ) : (
              tasks
                .filter(t => {
                  if (statusFilter === 'all') return true;
                  return (t.status || '').toLowerCase() === statusFilter;
                })
                .map((t, index) => {
                const status = (t.status || '').toLowerCase();
                const statusStyles =
                  status === 'pending'
                    ? { bg: '#fde047', color: '#111827' } // yellow / dark text
                    : status === 'in progress'
                    ? { bg: '#60a5fa', color: '#0b1020' } // blue / dark text for readability
                    : status === 'completed'
                    ? { bg: '#4ade80', color: '#052e16' } // green / dark text
                    : { bg: '#94a3b8', color: '#0f172a' }; // fallback slate

                return (
                  <TableRow
                    key={t._id}
                    hover
                    onClick={() => setSelected(t)}
                    style={{ cursor: 'pointer' }}
                    sx={{ '& td': { py: 1.5 } }}
                  >
                    <TableCell sx={{ color: 'white', width: 72 }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{t.title}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{t.description}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          px: 1.25,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: statusStyles.bg,
                          color: statusStyles.color,
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      >
                        {t.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
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


