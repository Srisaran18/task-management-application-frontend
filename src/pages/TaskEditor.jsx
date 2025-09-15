import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, MenuItem, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../Config";

const statuses = ["Pending", "In Progress", "Completed"];

const TaskEditor = () => {
  const nav = useNavigate();
  const { state } = useLocation();
  const editing = state?.edit || null;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setDescription(editing.description || "");
      setStatus(editing.status || "Pending");
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim() || !status.trim()) {
      setError("All fields are required");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tasks${editing ? `/${editing._id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({ title, description, status })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Save failed");
      nav("/tasks/list");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      p: 3,
      borderRadius: 2
    }}>
      <Container maxWidth="sm">
        <Typography variant="h6" mb={2} sx={{ color: 'white' }}>{editing ? "Edit Task" : "Add Task"}</Typography>
        {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
        <Box component="form" onSubmit={submit}>
          <TextField 
            label="Title" 
            fullWidth 
            margin="normal" 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#334155',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                '& input': { color: 'white' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
            }}
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="normal" 
            multiline 
            minRows={3} 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#334155',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                '& textarea': { color: 'white' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
            }}
          />
          <TextField 
            select 
            label="Status" 
            fullWidth 
            margin="normal" 
            value={status} 
            onChange={e=>setStatus(e.target.value)} 
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#334155',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                '& .MuiSelect-select': { color: 'white' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
            }}
          >
            {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <Button 
            variant="contained" 
            type="submit" 
            disabled={saving}
            sx={{ 
              backgroundColor: 'white',
              color: '#1e293b',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            {editing ? "Save" : "Create"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TaskEditor;


