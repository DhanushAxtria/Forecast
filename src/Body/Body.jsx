import { React, useState, useEffect, useContext } from 'react';
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
import Button from '@mui/material/Button';
import introJs from 'intro.js';
import { MyContext } from './context';


const demo_data = [
  { scenario: 'Brand A - Scenario 2', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Nov 2024', user: 'John Doe' },
  { scenario: 'Brand C - Scenario 2', cycle: '2023 H2', country: 'Denmark', area: 'Oncology', modified: '15 Sep 2023', user: 'Chris Jones' },
  { scenario: 'Brand B - Scenario 2', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '21 Jun 2023', user: 'Emma Clark' },
  { scenario: 'Brand B - Scenario 1', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '27 Mar 2023', user: 'John Doe' },
];

const demo_data1 = [
  { scenario: 'Brand A - Scenario 2', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Nov 2024', user: 'John Doe' },
  { scenario: 'Brand B - Scenario 2', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '21 Jun 2023', user: 'Emma Clark' },
];
const demo_data2 = [
  { scenario: 'Brand A - Scenario 1', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Sep 2024', user: '' },
  { scenario: 'Brand C - Scenario 2', cycle: '2023 H2', country: 'Denmark', area: 'Oncology', modified: '15 Sep 2023', user: '' },
  { scenario: 'Brand D - Scenario 1', cycle: '2023 H1', country: 'Sweden', area: 'Oncology', modified: '22 Jun 2023', user: '' },
  { scenario: 'Brand B - Scenario 2', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '21 Jun 2023', user: '' },
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
  const { tutHome, setTutHome } = useContext(MyContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted && tutHome) {
        setTutHome(false);
        showTutorial();  // Start the tutorial
      }
    }, 1000); // Start after 1 second
    return () => {
      clearTimeout(timer);
      isMounted = false;
    }; // Cleanup the timer

  }, []);
  const showTutorial2 = () => {
    const end = introJs();
    end.setOptions({
      steps: [
        {
          element: '.start-tour-button',
          intro: 'You can click here to rewatch the tutorial.',
          position: 'left'
        },
      ],
      showProgress: false, // Disable progress bar
      showStepNumbers: false,
      showBullets: false,
      nextLabel: '', // Remove "Next" button label
      prevLabel: '', // Remove "Previous" button label    
      showButtons: false, // Disable default Next/Prev buttons
    });

    end.onafterchange(() => {
      const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
      const tooltip = document.querySelector('.introjs-tooltip');
      const crossIcon = document.querySelector('.introjs-skipbutton')

      if (crossIcon) {
        Object.assign(crossIcon.style, {
          color: "red",
          padding: "2px",
          marginBottom: '0px'
        })
      }
      // Remove any existing buttons in the tooltip
      if (tooltipContainer) {
        tooltipContainer.innerHTML = ''; // Clear all buttons
      }

      // Style the tooltip box
      if (tooltip) {
        Object.assign(tooltip.style, {
          backgroundColor: '#f9f9f9',
          color: '#333',
          whiteSpace: 'nowrap',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: "5px",
          maxWidth: '500px',
          fontSize: '14px',
          minWidth: '300px',
          textAlign: 'center',
        });
        tooltip.style.display = 'flex';
        tooltip.style.flexDirection = 'column';
        tooltip.style.justifyContent = 'space-between';
      }
    });


    end.start();
  };
  const showTutorial = () => {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '.model-button',
          intro: 'Click here to create a new model of two types: Time Series or Epidemiology.',
        },
        {
          element: '.existing-button',
          intro: 'Click here to view and edit Existing Models.',
        },
        {
          element: '.submission-template',
          intro: 'Click here to track Submitted Models.',
        },
        {
          element: '.report-button',
          intro: 'Click here to create a Standard Report, Data Consolidation, or Scenario/Model Comparison.',
        },
        {
          element: '.admin-button',
          intro: 'Click here to access Admin-level information.',
        },
        {
          element: '.table-button',
          intro: 'These tabs contain your recent files, pinned files, and files recently shared with you.',
        }
      ],
      showProgress: false, // Disable progress bar
      showStepNumbers: false,
      showBullets: false,
      nextLabel: 'Next Step',
      prevLabel: 'Previous Step',
      doneLabel: 'Finished'
    });

    intro.onafterchange(() => {
      const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
      const nextButton = document.querySelector('.introjs-nextbutton');
      const prevButton = document.querySelector('.introjs-prevbutton');
      const tooltip = document.querySelector('.introjs-tooltip');
      const totalSteps = intro._options.steps.length; // Get total number of steps
      const currentStep = intro._currentStep; // Get current step index
      console.log(currentStep)
      console.log(totalSteps)

      // Remove default close button
      const crossIcon = document.querySelector('.introjs-skipbutton');
      if (crossIcon) {
        crossIcon.remove();
      }

      // Add a custom "Skip Tutorial" button
      let customSkipButton = document.querySelector('.custom-skip-button');
      if (!customSkipButton) {
        customSkipButton = document.createElement('button');
        customSkipButton.className = 'custom-skip-button';
        Object.assign(customSkipButton.style, {
          backgroundColor: 'red',
          fontSize: '12px',
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: 'none',
          border: 'none',
          cursor: 'pointer',
          height: '20px',
          borderRadius: '5px',
        });

        customSkipButton.onclick = () => {
          intro.exit(); // End the current tour
          showTutorial2(); // Start the second tour
        };

        if (tooltipContainer && prevButton) {
          tooltipContainer.insertBefore(customSkipButton, prevButton.nextSibling);
        }
      }

      // Update the custom "Skip Tutorial" button text dynamically
      if (currentStep === totalSteps - 1) {
        customSkipButton.textContent = 'Close'; // Change Skip button text to "Close"
      } else {
        customSkipButton.textContent = 'Skip Tutorial'; // Reset Skip button text
      }

      if (nextButton) {
        if (currentStep === totalSteps - 1) {
          // Disable and style the Next button on the last step
          nextButton.disabled = true;
          Object.assign(nextButton.style, {
            position: 'absolute',
            bottom: '15px',
            right: '10px',
            backgroundColor: 'grey',
            color: 'white',
            cursor: 'not-allowed',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: 'none',
          });
        } else {
          // Enable and style the Next button for other steps
          nextButton.disabled = false;
          Object.assign(nextButton.style, {
            position: 'absolute',
            bottom: '15px',
            right: '10px',
            backgroundColor: 'green',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: 'none',
          });
        }
      }

      // Style the Previous button
      if (prevButton) {
        if (currentStep === 0) {
          prevButton.disabled = true;
          Object.assign(prevButton.style, {
            backgroundColor: 'grey',
            fontSize: '12px',
            color: 'white',
            marginRight: '40px',
            fontWeight: 'bold',
            textShadow: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
          });
        }
        else {
          Object.assign(prevButton.style, {
            backgroundColor: 'navy',
            fontSize: '12px',
            color: 'white',
            marginRight: '40px',
            fontWeight: 'bold',
            textShadow: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
          })
        }
      }

      // Style the tooltip box
      if (tooltip) {
        Object.assign(tooltip.style, {
          backgroundColor: '#f9f9f9',
          color: '#333',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '5px',
          maxWidth: '500px',
          fontSize: '14px',
          minWidth: '300px',
          textAlign: 'center',
        });
      }
    });

    intro.start();
  };
  const handleStartTutorial = () => {
    showTutorial();
  };
  return (
    <>
      <Box>
        <Box mt={8} display="flex" justifyContent="center" alignItems="center">
          <Button
            className='start-tour-button'
            variant="contained"
            size='small'
            sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: -18, mr: 3 }}
            onClick={() => handleStartTutorial()}
          >
            Show Tutorial
          </Button>
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
              className: "model-button",
              color: 'linear-gradient(135deg, #00c6ff, #0072ff)',
              title: 'New Model',
              description: 'Create a new model based on market data and trends.',
              icon: <Assessment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/new-model',
            },
            {
              className: "existing-button",
              color: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              title: 'Existing Models',
              description: 'Access and manage your previously saved models.',
              icon: <SaveAlt sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/saved-scenario',
            },
            {
              className: "submission-template",
              color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
              title: 'Submissions Tracker',
              description: 'Track the status of all submitted forecast models.',
              icon: <QueryStats sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/submissions-tracker',
            },
            {
              className: "report-button",
              color: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
              title: 'Generate Report',
              description: 'Generate reports based on your forecast scenarios.',
              icon: <Assignment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/generate-report',
            },
            {
              className: "admin-button",
              color: 'linear-gradient(135deg, #f857a6, #ff5858)',
              title: 'Admin',
              description: 'Manage and secure forecast models with admin privileges.',
              icon: <Security sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/admin',
            },
          ].map((item, index) => (
            <Box
              key={index}
              className={item.className}
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
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: '80%' }}>
          <Tabs
            className="table-button"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              '& .MuiTab-root': { borderRadius: '8px', transition: '0.3s' }, // Smooth transitions
            }}
          >
            <Tab
              label="Recent"
              {...a11yProps(0)}
              sx={{
                backgroundColor: value === 0 ? 'grey.200' : 'transparent',
                color: value === 0 ? 'white' : 'black',
                fontWeight: value === 0 ? 'bold' : 'normal',
                
              }}
            />
            <Tab
              label="Pinned"
              {...a11yProps(1)}
              sx={{
                backgroundColor: value === 1 ? 'grey.200' : 'transparent',
                color: value === 1 ? 'white' : 'black',
                fontWeight: value === 1 ? 'bold' : 'normal',
                
              }}
            />
            <Tab
              label="Shared with me"
              {...a11yProps(2)}
              sx={{
                backgroundColor: value === 2 ? 'grey.200' : 'transparent',
                color: value === 2 ? 'white' : 'black',
                fontWeight: value === 2 ? 'bold' : 'normal',
                
              }}
            />
          </Tabs>
        </Box>
      </Box>



      {(
        <Box display="flex" justifyContent="center">
          <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
            <Table aria-label="submission scenarios table" size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  {/* Scenario Name */}
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Model Name</TableCell>
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
                {(value === 0 ? demo_data : value === 1 ? demo_data1 : demo_data2).map((row, index) => (
                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white' }}>
                    {/* Scenario Name */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>{row.scenario}</TableCell>
                    {/* Forecast Cycle */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>{row.cycle}</TableCell>
                    {/* Country */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>{row.country}</TableCell>
                    {/* Therapeutic Area */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>{row.area}</TableCell>
                    {/* Last Modified Date */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>{row.modified}</TableCell>
                    {/* Submitted by */}
                    <TableCell align="center" sx={{ minWidth: '100px' }}>
                      {value === 0 ? demo_data[index].user : value === 1 ? demo_data1[index].user : ["Michael Wang", "Chris Jones", "Jane Smith", "Emma Clark"][index]}
                    </TableCell>
                    {/* Actions */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};
export default Body;
