// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Container, Button, Select, MenuItem, Stack, Paper, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API_BASE from "../Config";
import { useAuth } from "../context/AuthContext";
import TaskFormDialog from "./TaskFormDialog";

const statuses = ["Pending", "In Progress", "Completed"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/tasks` + (filter ? `?status=${encodeURIComponent(filter)}` : ""), {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(result);
      } else {
        setError(result.message || "Failed to load tasks");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      if (response.ok) {
        loadTasks();
      } else {
        const result = await response.json();
        setError(result.message || "Failed to delete task");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  useEffect(() => { loadTasks(); }, [filter]);

  // Table view lists all tasks by default; filtering is applied in the fetch above

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Tasks — {user?.name}</Typography>
          <Button color="inherit" onClick={()=>setOpen(true)} startIcon={<AddTaskIcon/>}>New Task</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 3 }}>
      <Container>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>
        )}
        
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography>Filter:</Typography>
          <Select size="small" value={filter} onChange={e => setFilter(e.target.value)} displayEmpty>
            <MenuItem value=""><em>All</em></MenuItem>
            {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </Stack>

        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 700 }}>Task</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ color: 'common.white', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Loading...</TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No tasks found</TableCell>
                </TableRow>
              ) : (
                tasks.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setEditing(t); setOpen(true); }} aria-label="edit">
                        <EditIcon/>
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTask(t._id)} aria-label="delete">
                        <DeleteIcon/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
      </Box>

      <TaskFormDialog
        open={open}
        initial={editing}
        onClose={() => { setOpen(false); setEditing(null); }}
        onSaved={() => { setOpen(false); setEditing(null); loadTasks(); }}
      />
    </>
  );
};

export default Dashboard;