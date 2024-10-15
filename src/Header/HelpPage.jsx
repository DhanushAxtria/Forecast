import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';

export default function HelpPage() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Title */}
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Welcome to the Axtria Forecast Tool Help Center
      </Typography>

      {/* Overview Section */}
      <Card sx={{ display: 'flex', mb: 4, boxShadow: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 300 }}
          image="/"  // Replace with an actual image path
          alt="Forecast tool illustration"
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            What is the Axtria Forecast Tool?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The Axtria Forecast Tool is a powerful and intuitive application designed to help you create, manage, and analyze forecasts efficiently. Whether you’re handling large datasets, comparing different scenarios, or diving deep into forecast insights, this tool provides all the functionalities you need for accurate and data-driven decision making.
          </Typography>
          <Typography variant="body1">
            With features like data consolidation, scenario comparison, and forecast deep-dive, Axtria ensures you have the right tools to optimize your forecasting process.
          </Typography>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          Key Features
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText
              primary="New Scenario"
              secondary="Create new forecast scenarios with real-time data to analyze future outcomes."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SaveAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="Saved Scenario"
              secondary="Manage and revisit saved scenarios for comparison and further analysis."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CompareArrowsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Scenario Comparison"
              secondary="Compare different forecast scenarios to evaluate performance and risks."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FilePresentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Data Consolidation"
              secondary="Consolidate and streamline your datasets for easier processing and analysis."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Forecast Deep-Dive"
              secondary="Get deeper insights into your forecasts by exploring detailed data breakdowns."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Admin Control"
              secondary="Control access, manage users, and configure permissions to secure your data."
            />
          </ListItem>
        </List>
      </Paper>

      {/* Grid Section for additional helpful tips */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                How to Create a New Scenario
              </Typography>
              <Typography variant="body2">
                To create a new scenario, navigate to the 'New Scenario' option from the dashboard. You will be prompted to input the necessary data, select parameters, and generate a forecast based on real-time data or historical trends.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Managing Saved Scenarios
              </Typography>
              <Typography variant="body2">
                You can view and manage your saved scenarios from the 'Saved Scenario' section. This allows you to revisit old forecasts, compare them with new ones, and track changes over time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Scenario Comparison
              </Typography>
              <Typography variant="body2">
                Use the 'Scenario Comparison' feature to evaluate different forecasting models side by side. This is crucial for identifying the best strategy or adjusting your forecast based on different conditions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Data Consolidation
              </Typography>
              <Typography variant="body2">
                The 'Data Consolidation' feature helps you streamline and merge different datasets for better clarity and easier processing. Perfect for large-scale operations where data organization is key.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
