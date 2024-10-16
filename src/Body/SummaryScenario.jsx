import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function ReviewScenarioSummary() {
  const location = useLocation();
  const { scenario } = location.state; // Get the passed scenario data from the location state

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Review Scenario Summary: {scenario.scenario}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Country:</strong> {scenario.country}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Therapeutic Area:</strong> {scenario.area}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Forecast Cycle:</strong> {scenario.cycle}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Last Modified:</strong> {scenario.modified}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Submitted by:</strong> {scenario.user}
      </Typography>
    </Box>
  );
}
