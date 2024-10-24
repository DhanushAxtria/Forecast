import React from 'react';
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

// Breadcrumb names mapping
const breadcrumbNameMap = {
  '/new-scenario': 'New Scenario',
  '/saved-scenario': 'Saved Scenario',
  '/data-consolidation': 'Data Consolidation',
  '/scenario-comparison': 'Scenario Comparison',
  '/forecast-deep-dive': 'Forecast Deep-dive',
  '/admin': 'Admin',
  '/generate-report': 'Generate Report',
  '/submission-tracking': 'Submissions Tracker',
};

// Component for dynamic breadcrumbs
function DynamicBreadcrumbs() {
  const location = useLocation(); // Get current location (pathname)
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);
  const isHomePage = location.pathname === '/';
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ margin: '16px 0' }}> {/* Adjust the margin here */}
      {!isHomePage && ( // Only show the Home Icon and link if it's NOT the homepage
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
      )}

      {/* Dynamic breadcrumbs */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        const isLast = index === pathnames.length - 1;
        return isLast ? (
          // The last breadcrumb should not be a link
          <Typography color="text.primary" key={to}>
            {breadcrumbNameMap[to] || value}
          </Typography>
        ) : (
          // Other breadcrumbs are clickable links
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
export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); 
  const username = "John Doe";  // Replace this with dynamic data

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
              <MenuIcon sx={{ color: 'black' }}/>
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
              sx={{ fontWeight: 'bold', color: 'black',paddingLeft: '80px',fontSize:'2rem'}}
            >
              Axtria Forecast Tool
            </Typography>
          </Box>

          {/* Right side: Help, Support, and User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpIcon onClick={() => navigate('/help')} sx={{ mx: 1,color:'black' }} />
            <Summarize onClick={() => navigate('/generate-report')} sx={{ mx: 1, cursor: 'pointer',color:'black' }} />
            <TrackChanges onClick={() => navigate('/submission-tracking')} sx={{ mx: 1, cursor: 'pointer' ,color:'black'}} />
            <SupportIcon onClick={() => window.open("https://axtria.com", "_blank")} sx={{ mx: 1 ,color:'black'}} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircle sx={{ mr: 1 ,color:'black'}} /> 
              <Typography variant="body1" sx={{ color: 'black' }}>{username}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* **Breadcrumbs placed below the header** */}
      <Box component="nav" sx={{ width: '100%', padding: '16px', marginTop: '64px' }}> {/* Adjust marginTop to fit below AppBar */}
        <DynamicBreadcrumbs />
      </Box>

      {/* Drawer component */}
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
            <Typography
              variant="h6"
              sx={{
                padding: '5px 10px',
                fontWeight: 600,
                borderRadius: '8px',
                display: 'inline-block',
              }}
            >
              Dashboard
            </Typography>
          </Box>
        </DrawerHeader>

        {/* Drawer navigation items */}
        <List>
          {[{ text: 'New Scenario', icon: <Assessment />, path: '/new-scenario' },
            { text: 'Saved Scenario', icon: <SaveAlt />, path: '/saved-scenario' },
            { text: 'Data Consolidation', icon: <FilePresent />, path: '/data-consolidation' },
            { text: 'Scenario Comparison', icon: <CompareArrows />, path: '/scenario-comparison' },
            { text: 'Forecast Deep-dive', icon: <Insights />, path: '/forecast-deep-dive' },
            { text: 'Generate Report', icon: <Summarize />, path: '/generate-report' },  // Added
            { text: 'Submissions Tracker', icon: <TrackChanges />, path: '/submission-tracking' }, // Added
            { text: 'Admin', icon: <Security />, path: '/admin' }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
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
