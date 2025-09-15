import React, { useState } from "react";
import { Outlet, Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Checklist";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const [openTasks, setOpenTasks] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const onLogout = () => {
    handleClose();
    logout();
    navigate("/login", { state: { loggedOut: true } });
  };

  const toggleMobileDrawer = () => setMobileOpen(v => !v);

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to="/" 
              selected={location.pathname === "/"}
              sx={{ 
                '&.Mui-selected': { backgroundColor: '#334155' },
                '&:hover': { backgroundColor: '#334155' }
              }}
              onClick={() => { if (isMobile) setMobileOpen(false); }}
            >
              <ListItemIcon><HomeIcon sx={{ color: 'white' }}/></ListItemIcon>
              <ListItemText primary="Home" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setOpenTasks(v => !v)}
              sx={{ 
                '&:hover': { backgroundColor: '#334155' }
              }}
            >
              <ListItemIcon><TaskIcon sx={{ color: 'white' }}/></ListItemIcon>
              <ListItemText primary="Tasks" sx={{ color: 'white' }} />
              {openTasks ? <ExpandLess sx={{ color: 'white' }}/> : <ExpandMore sx={{ color: 'white' }}/>} 
            </ListItemButton>
          </ListItem>
          <Collapse in={openTasks} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  component={RouterLink} 
                  to="/tasks/new" 
                  selected={location.pathname === "/tasks/new"}
                  sx={{ 
                    pl: 4,
                    '&.Mui-selected': { backgroundColor: '#334155' },
                    '&:hover': { backgroundColor: '#334155' }
                  }}
                  onClick={() => { if (isMobile) setMobileOpen(false); }}
                >
                  <ListItemText primary="Add Task" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  component={RouterLink} 
                  to="/tasks/list" 
                  selected={location.pathname.startsWith("/tasks/list")}
                  sx={{ 
                    pl: 4,
                    '&.Mui-selected': { backgroundColor: '#334155' },
                    '&:hover': { backgroundColor: '#334155' }
                  }}
                  onClick={() => { if (isMobile) setMobileOpen(false); }}
                >
                  <ListItemText primary="List Tasks" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
        <Divider sx={{ borderColor: '#334155' }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>Signed in as</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: 'white' }}>{user?.name || user?.email}</Typography>
          <ListItemButton 
            onClick={onLogout} 
            sx={{ 
              border: '1px solid', 
              borderColor: '#334155', 
              borderRadius: 1,
              '&:hover': { backgroundColor: '#334155' }
            }}
          >
            <ListItemText primary="Logout" sx={{ color: 'white' }} />
          </ListItemButton>
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e293b' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleMobileDrawer} sx={{ mr: 1 }}>
              {/* use MoreVert as fallback hamburger */}
              <MoreVertIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Task Manager</Typography>
          <Avatar sx={{ width: 32, height: 32, mr: 1, backgroundColor: '#3b82f6' }}>{user?.name?.[0]?.toUpperCase() || "U"}</Avatar>
          <IconButton color="inherit" onClick={handleMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} keepMounted>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Permanent drawer on desktop */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{ 
          width: drawerWidth, 
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: "border-box",
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155'
          } 
        }}>
          {drawerContent}
        </Drawer>
      )}
      {/* Temporary drawer on mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', sm: 'block', md: 'none' },
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: "border-box",
              backgroundColor: '#1e293b',
              borderRight: '1px solid #334155'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 2, md: 3 }, ml: 0 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarLayout;


