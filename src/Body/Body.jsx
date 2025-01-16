import { React, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import "./Body.scss";
import {
  Assessment,
  SaveAlt,
  QueryStats,
  Assignment,
  Security,
} from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const demo_data = [
  { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
  { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
  { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '28 Sep 2024', user: 'User 1' },
  { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '27 Sep 2024', user: 'User 1' },
];


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Body = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box>
        <Box mt={8} display="flex" justifyContent="center" alignItems="center">
          <h3>Welcome User, Please Select an Action to Proceed</h3>
        </Box>
        <Box
          mt={-5}
          sx={{
            padding: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2,
          }}
        >
          {[
            {
              color: 'linear-gradient(135deg, #00c6ff, #0072ff)',
              title: 'New Model',
              description: 'Create a new model based on market data and trends.',
              icon: <Assessment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/new-model',
            },
            {
              color: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              title: 'Existing Models',
              description: 'Access and manage your previously saved models.',
              icon: <SaveAlt sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/saved-scenario',
            },
            {
              color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
              title: 'Submissions Tracker',
              description: 'Track the status of all submitted forecast models.',
              icon: <QueryStats sx={{ fontSize: 50, color: 'black', margin: '20px' }} />,
              path: '/submissions-tracker',
            },
            {
              color: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
              title: 'Generate Report',
              description: 'Generate detailed reports based on your forecast scenarios.',
              icon: <Assignment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/generate-report',
            },
            {
              color: 'linear-gradient(135deg, #f857a6, #ff5858)',
              title: 'Admin',
              description: 'Manage and secure forecast models with admin privileges.',
              icon: <Security sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/admin',
            },
          ].map((item, index) => (
            <Box
              key={index}
              className="hoverCard"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 280,
                  background: item.color,
                  color: 'white',
                }}
                className="featureCard"
              >
                <CardActionArea
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <div className="tooltipAbove">{item.description}</div>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Recent" {...a11yProps(0)} />
            <Tab label="Pinned" {...a11yProps(1)} />
            <Tab label="Shared with me" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </Box>
      {(
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table aria-label="submission scenarios table" size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                {/* Scenario Name */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Scenario</TableCell>
                {/* Forecast Cycle */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                {/* Country */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Country</TableCell>
                {/* Therapeutic Area */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                {/* Last Modified Date */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Last Modified</TableCell>
                {/* Submitted by */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Submitted by</TableCell>
                {/* Actions */}
              </TableRow>
            </TableHead>
            <TableBody>
              {demo_data.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white' }}>
                  {/* Scenario Name */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.scenario}</TableCell>
                  {/* Forecast Cycle */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.cycle}</TableCell>
                  {/* Country */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.country}</TableCell>
                  {/* Therapeutic Area */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.area}</TableCell>
                  {/* Last Modified Date */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.modified}</TableCell>
                  {/* Submitted by */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.user}</TableCell>
                  {/* Actions */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </>
  );
};
export default Body;
