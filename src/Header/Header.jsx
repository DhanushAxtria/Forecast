import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import Assessment from '@mui/icons-material/Assessment';    // Forecast icon
import SaveAlt from '@mui/icons-material/SaveAlt';    // Report design icon
import FilePresent from '@mui/icons-material/FilePresent';  // Model design icon
import CompareArrows from '@mui/icons-material/CompareArrows';  // Forecast manager icon
import Insights from '@mui/icons-material/Insights';      // Data management icon
import Security from '@mui/icons-material/Security';  // Admin icon
import HelpIcon from '@mui/icons-material/Help';
import SupportIcon from '@mui/icons-material/Support';
import axtriaImage from "../assets/axtria-logo.png";
import './Header.scss';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
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
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between', // Center the name between arrow and edge
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
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
              <MenuIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <img src={axtriaImage} id="headerImage" alt="Logo" />
            </IconButton>
          </Box>

          {/* Center: Header Text */}
          <Typography
            className="forecast_header"
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}
          >
            Axtria Forecast Tool
          </Typography>

          {/* Right side: Help and Support Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpIcon
              onClick={() => {
                window.open("https://google.com", "_blank");
              }}
              sx={{ mx: 1 }}
            />
            <SupportIcon
              onClick={() => {
                window.open("https://axtria.com", "_blank");
              }}
              sx={{ mx: 1 }}
            />
          </Box>
        </Toolbar>
      </AppBar>
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
          {/* Drawer name in the middle with background color */}
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                padding: '5px 10px',
                fontWeight:600,
                borderRadius: '8px',        // Rounded corners for better appearance
                display: 'inline-block',    // Make sure it only wraps around the text
              }}
            >
              Dashboard
            </Typography>
          </Box>
        </DrawerHeader>
        <List>
          {[
            { text: 'New Scenario', icon: <Assessment />, path: '/new-scenario'},
            { text: 'Saved Scenario', icon: <SaveAlt />, path:'/saved-scenario'},
            { text: 'Data consolidation', icon: <FilePresent />, path:'/data-consolidation' },
            { text: 'Scenario Comparsion', icon: <CompareArrows /> , path:'/scenario-comparsion'},
            { text: 'Forecast Deep-dive', icon: <Insights /> },
            { text: 'Admin', icon: <Security /> }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => item.path && window.open(item.path,  '_blank')}>

                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Main content will go here */}
      </Main>
    </Box>
  );
}
