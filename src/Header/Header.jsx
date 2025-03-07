//import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import Summarize from '@mui/icons-material/Summarize';
import TrackChanges from '@mui/icons-material/TrackChanges';
import Assessment from '@mui/icons-material/Assessment';
import SaveAlt from '@mui/icons-material/SaveAlt';
import FilePresent from '@mui/icons-material/FilePresent';
import CompareArrows from '@mui/icons-material/CompareArrows';
import Insights from '@mui/icons-material/Insights';
import Security from '@mui/icons-material/Security';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpIcon from '@mui/icons-material/Help';
import SupportIcon from '@mui/icons-material/Support';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import axtriaImage from '../assets/axtria-logo.png';
import React, { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

// **Define the drawer width**
const drawerWidth = 240;

// **Styled Main content layout**
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '25px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

// **DrawerHeader styled component for the drawer header**
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const breadcrumbNameMap = {
  '/new-model': 'New Model',
  '/new-model/epidemiology-model': 'New Scenario',
  '/new-model/epidemiology-model/scenario-details': 'Scenario Details',
  '/scenario-details': 'New Scenario / Scenario Details',
  '/new-model/epidemiology-model/scenario-details/Inputpage': 'Input page',
  '/new-model/epidemiology-model/model1/analysis' : 'Model 1 Analysis',
  '/new-model/epidemiology-model/model1': 'Model 1',
  '/Inputpage': 'New Scenario / Scenario Details / Input page',
  '/saved-scenario': 'Existing Models',
  '/data-consolidation': 'Data Consolidation',
  '/scenario-comparison': 'Scenario Comparison',
  '/forecast-deep-dive': 'Time Series Methods',
  '/new-model/epidemiology-model/scenario-details/forecastdeepdive': 'Patient Based Forecasting',
  '/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis':'Analysis',
  '/admin': 'Admin',
  '/generate-report': 'Generate Report',
  '/submissions-tracker': 'Submissions Tracker',
  '/new-model/time-series-model': 'Time Series Model'
};

// Component for dynamic breadcrumbs
function DynamicBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter(Boolean);
  if (location.pathname === '/') return null;
  //const isHomePage = location.pathname === '/';

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ margin: '16px 0' }}>
      <Link
        underline="hover"
        color="inherit"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>

      {/* Iterate through each path segment to build breadcrumbs */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {breadcrumbNameMap[to] || value}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            key={to}
            onClick={(event) => {
              event.preventDefault();
              navigate(to);
            }}
          >
            {breadcrumbNameMap[to] || value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

// Main layout with drawer and dynamic breadcrumbs
export default function PersistentDrawerLeft(props) {
  const {hasUnsavedChanges} = props
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  //const isHomePage = location.pathname === "/";
  const username = "John Doe";  // Replace this with dynamic data

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleHeaderClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true); // Show the confirmation dialog if there are unsaved changes
    } else {
      navigate('/'); // Directly navigate to the homepage if no unsaved changes
    }
  };
  const confirmNavigation = () => {
    setShowConfirmDialog(false);
    navigate('/');
  };
  const cancelNavigation = () => {
    setShowConfirmDialog(false);
  };

  const navigateToHome = ()=>{
    // navigate('/');
    setShowConfirmDialog(true);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar (Header) */}
      <AppBar position="fixed" open={open} sx={{
        backgroundColor: '#87CEEB', // Custom background color for the header
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Optional shadow
      }}>
        <Toolbar className="toolBarDiv" sx={{ justifyContent: 'space-between' }}>
          {/* Left side: Menu icon and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon sx={{ color: 'black' }} />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <img src={axtriaImage} id="headerImage" alt="Logo" style={{ width: '120px', height: 'auto' }} />
            </IconButton>
          </Box>

          {/* Center: Header Text */}
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography
              className="forecast_header"
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 'bold', color: 'black', paddingLeft: '80px', fontSize: '2rem', cursor: 'pointer' }}
              onClick={navigateToHome}
            >
              Axtria Forecast Tool
            </Typography>
          </Box>

          {/* Right side: Help, Support, and User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpIcon onClick={() => navigate('/help')} sx={{ mx: 1, color: 'black' }} />
            <Summarize onClick={() => navigate('/generate-report')} sx={{ mx: 1, cursor: 'pointer', color: 'black' }} />
            <TrackChanges onClick={() => navigate('/submission-tracking')} sx={{ mx: 1, cursor: 'pointer', color: 'black' }} />
            <SupportIcon onClick={() => window.open("https://axtria.com", "_blank")} sx={{ mx: 1, color: 'black' }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircle sx={{ mr: 1, color: 'black' }} />
              <Typography variant="body1" sx={{ color: 'black' }}>{username}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={showConfirmDialog} onClose={cancelNavigation}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to leave this page without saving?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelNavigation} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmNavigation} color="primary">
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* **Breadcrumbs placed below the header** */}
      <Box component="nav" sx={{ width: '100%', padding: '16px', marginTop: '64px' }}> {/* Adjust marginTop to fit below AppBar */}
        <DynamicBreadcrumbs />
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ padding: '5px 10px', fontWeight: 600, borderRadius: '8px', display: 'inline-block' }}>
              Dashboard
            </Typography>
          </Box>
        </DrawerHeader>

        <List sx={{ width: '100', bgcolor: 'background.paper', borderRadius: '10px', overflow: 'auto' }}>
          {[
            { text: 'New Model', icon: <Assessment />, path: '/new-model/epidemiology-model' },
            { text: 'Existing Model', icon: <SaveAlt />, path: '/saved-scenario' },
            { text: 'Submissions Tracker', icon: <TrackChanges />, path: '/submissions-tracker' },
            { text: 'Generate Report', icon: <Summarize />, path: '/generate-report' },
            { text: 'Admin', icon: <Security />, path: '/admin' }
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
              <ListItemButton onClick={() => {
                navigate(item.path);
                handleDrawerClose();  // Close the drawer after navigating
              }} sx={{ borderRadius: '10px' }}>
                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                <Tooltip title={item.text} placement="top">
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content area */}
      <Main open={open}>
        <DrawerHeader />
        <Typography variant="h4">
          {/* Main content will go here */}
        </Typography>
      </Main>
    </Box>
  );
}
