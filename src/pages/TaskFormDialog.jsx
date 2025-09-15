// src/pages/TaskFormDialog.js
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography } from "@mui/material";
import { API_BASE } from "../Config";

const statuses = ["Pending", "In Progress", "Completed"];

const TaskFormDialog = ({ open, initial, onClose, onSaved }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setDescription(initial.description || "");
      setStatus(initial.status || "Pending");
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
    setTitleError("");
    setDescriptionError("");
    setStatusError("");
    setSaveError("");
  }, [initial, open]);

  const handleSubmit = async () => {
    setSaveError("");
    let isValid = true;

    if (title.trim() === "") {
      setTitleError("Title is required.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (description.trim() === "") {
      setDescriptionError("Description is required.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!status) {
      setStatusError("Status is required.");
      isValid = false;
    } else {
      setStatusError("");
    }

    if (isValid) {
      setSaving(true);
      try {
        const token = localStorage.getItem("token");
        const taskData = {
          title: title,
          description: description,
          status: status
        };
        const response = await fetch(`${API_BASE}/tasks${initial ? `/${initial._id}` : ""}`, {
          method: initial ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined
          },
          body: JSON.stringify(taskData)
        });
        const result = await response.json();
        if (response.ok) {
          onSaved?.();
        } else {
          setSaveError(result.message || "Save failed");
        }
      } catch (err) {
        setSaveError("Server error. Please try again later.");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        {saveError && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>{saveError}</Typography>
        )}
        
        <TextField 
          fullWidth 
          margin="normal" 
          label="Title" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={!!titleError}
          helperText={titleError}
          required
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Description" 
          multiline 
          minRows={3} 
          value={description}
          onChange={e => setDescription(e.target.value)}
          error={!!descriptionError}
          helperText={descriptionError}
          required
        />
        <TextField 
          select 
          fullWidth 
          margin="normal" 
          label="Status" 
          value={status}
          onChange={e => setStatus(e.target.value)}
          error={!!statusError}
          helperText={statusError}
          required
        >
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving} onClick={handleSubmit}>
          {initial ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;